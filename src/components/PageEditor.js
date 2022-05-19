
import {Component , createRef} from "preact";
import { useRef } from "preact/hooks";
import {html} from "htm/preact";
import {saveFile, convert2html} from "../fileops.js"

var md = require('markdown-it')({html:true})
.use(require('markdown-it-checkbox'))
.use(require('markdown-it-multimd-table') , { 
  headerless: true,
  multiline: true
})

import * as MDE from "easymde";
import {If} from "./If";
require("./editor.scss")
require("easymde/dist/easymde.min.css");



function TheInput(props){
  const inp = useRef(null);
  const onChange = ()=>{props.handler(inp.current.value)};

  return html`<div class="TheInput">
  <label for=${props.name || "" }>${props.title}</label>
  <${If} condition=${props.area==true}>
  <textarea ref=${inp} 
  class=${"area"+props.name}
  name=${props.name || ""} 
  onchange=${onChange}>
  ${props.value || ""}
  </textarea>
  </${If}>
  <${If} condition=${props.area==false}>
  <input type="text" ref=${inp} name=${props.name || ""}
  value=${props.value || ""}
  onchange=${onChange}
  ></input>
  </${If}>
  </div>`
   
}


export class PageEditor extends Component{
  constructor(props){
    super(props);
    this.mdEditorNode = createRef();
    this.modified=false;
    this.previewIframe;
    this.state = {
       text: props.text,
       action: "edit",
       title: props.settings.title() || "",
       image: props.settings.image() || "",
       filename: props.settings.filename() || "",
       description: props.settings.description(),
       customCSS: document.getElementById("customCSS").innerHTML
    }
  }
  handleInput(f,v){
      const ns = {};
      ns[f]=v;
      this.setState(ns);
      //handle customCSS and title here
  }
  makeHandler(f){
     const func =  (v)=>this.handleInput(f,v)
     func.bind(this);
     return func;
  }
  render(){
        // let p = document.getElementById("specialPreviewDiv");
        // console.log("Special" , p)
        // if(p){p.innerHTML = "I'm special"};
  // console.log("mde"  , mdes)
    return html`<div class="PageEditor">
      <div class="container" id="mainButtons">

      <div id="exportHTML"
      class=${this.modified ? "modified" : "nochange"}
      onclick=${()=>{
      console.log("export requested...") ;
      saveFile(md.render(this.state.text) , this.state.text , this.props.settings.copy() , window.savedHead);
      this.modified = false;

      }}
      > Export HTML </div>

      <div id="fullPreview"
      onclick=${()=>{
        
        let ci = document.getElementById("previewIframe");
        
        if(ci){ci.remove(); this.setState({action: "edit"}) ;return}

        let i = document.createElement("iframe");
        i.id="previewIframe";
        document.body.appendChild(i);
        this.radicalPreview(i);
        this.setState({action:"preview"})
      }
      }>${this.state.action=="preview" ? "Edit" : "Preview"}</div>
      </div>
      

      <div class="workZone">

        <!--markdown editor-->
        <textarea 
        class="editorArea"
        ref=${this.mdEditorNode}>
        </textarea>

        <!--form-->
        <div class="formRow">
        <${TheInput} 
        title=${"File name"}
        name=${"filename"}
        value=${this.state.filename}
        area=${false}
        handler=${this.makeHandler("filename")}
        />
        <div class="divider"></div>
        <${TheInput} 
        title=${"Title"}
        value=${this.state.title}
        name=${"title"}
        area=${false}
        handler=${this.makeHandler("title")}
        />
        </div>

        <div class="formRow">

        <${TheInput} 
        title=${"Preview image URL"}
        value=${this.state.image}
        name=${"image"}
        area=${false}
        handler=${this.makeHandler("image")}
        />
        </div>

        <${TheInput} 
        title=${"Description"}
        name=${"description"}
        value=${this.state.description}
        area=${true}
        handler=${this.makeHandler("description")}
        />
        <${TheInput} 
        title=${"Custom CSS"}
        name=${"css"}
        area=${true}
        value=${this.state.customCSS}
        handler=${this.makeHandler("customCSS")}
        />



      </div>
    </div>`
  }
  updateMdEditor(){

    const easyMDE = new MDE(
      {
        element: this.mdEditorNode.current ,
        syncSideBySidePreviewScroll: false,
        //autoDownloadFontAwesome: true,
        // previewRender: (m)=>{ this.radicalPreview(m); return null },
        // previewClass: "preview-panel-open",
        // previewRender: (m)=>null,
        previewRender: (m ,p)=>{   
        
    const phtml = convert2html(md.render(m) , "" , this.props.settings.copy() , window.savedHead);
      // console.log("p" , phtml);
        // return "<div id='specialPreviewDiv'></div>"
        return md.render(m) 
        // return `<iframe srcdoc="${phtml}"></iframe>`;
        },
        spellChecker: false,
        sideBySideFullscreen: false,
      });
      easyMDE.value( this.state.text );
      easyMDE.codemirror.on("change" , 
        ()=>{
        this.handleInput("text", easyMDE.value()) 
        } )


        console.log("MDE" , easyMDE);

  }
  fixPreview(p){
    console.log("fix preview...") 
    const iframeID = "radicalPreviewIframe";
    let e=p.getElementById(iframeID);
    console.log(e);
    if(!e){ 
      console.log("preview needs fixin")
      this.radicalPreview(this.state.text ,document.querySelector(".editor-preview"))
      }
    
  }
  radicalPreview(frame){
    const phtml = convert2html(md.render(this.state.text) , "" , this.props.settings.copy() , window.savedHead);
    frame.contentWindow.document.open();
    frame.contentWindow.document.write(phtml);
    frame.contentWindow.document.close();
  }
  componentDidMount(){
  this.updateMdEditor();
  }
  componentWillUpdate(){
    this.modified = true;
  }
  componentDidUpdate(){
   //update settings
   const s = this.props.settings;
   s.title(this.state.title)
   s.description(this.state.description)
   s.filename(this.state.filename)
   //update customCSS
   const ccsst = document.querySelector("#customCSS");
   ccsst.innerHTML = this.state.customCSS;
   //editor
  }
}

PageEditor.defaultProps = {
   text: "Test text",
   mode: "md"
}
