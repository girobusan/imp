
import {Component , createRef} from "preact";
import { useRef } from "preact/hooks";
import {html} from "htm/preact";
import {saveFile, saveToDisk , loadFromDisk, convert2html} from "../fileops.js"

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
const version = VERSION



function TheInput(props){
  const inp = useRef(null);
  const onChange = ()=>{props.handler(inp.current.value)};

  return html`<div class="TheInput">
  <label class="label" for=${props.name || "" }>${props.title}</label>
  <${If} condition=${props.area==true}>
  <textarea ref=${inp} 
  style="min-height: 150px;"
  class=${"input biginout area"+props.name}
  name=${props.name || ""} 
  onchange=${onChange}>
  ${props.value || ""}
  </textarea>
  </${If}>
  <${If} condition=${props.area==false}>
  <input class="input" type="text" ref=${inp} name=${props.name || ""}
  value=${props.value || ""}
  onchange=${onChange}
  ></input>
  </${If}>
  </div>`
   
}


export class PageEditor extends Component{
  constructor(props){
    super(props);
    // console.log("one")
    this.mdEditorNode = createRef();
    this.modified=false;
    this.previewIframe;
    this.state = {
       text: props.text,
       action: "edit",
       title: props.settings.title() || "",
       image: props.settings.image() || "",
       filename: props.settings.filename() || "",
       description: props.settings.description() || "",
       footer: props.settings.footer() || "",
       customCSS: this.findCustomCSS(),
       editor: props.settings.editor() || "",
       viewCSS: props.settings.viewCSS() || "",
       headHTML: props.settings.headHTML() || "",
    }
  }
  findCustomCSS(){
    if(this.props.settings.css()){ return this.props.settings.css() }
    
     let e = document.getElementById("customCSS");
     if(e && e.innerHTML){
        return e.innerHTML;
     }
     return "/* write your CSS here*/";
  }
  handleInput(f,v){
      // console.log(f,v);
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
      <div id="branding"><strong>IMP!</strong> ${version}</div>

      <div class="is-mobile" id="mainButtons">
    

      <input type=button id="exportHTML" value="Save"
      class=${this.modified ? "modified" : "not-modified"}
      onclick=${()=>{
      console.log("export requested...") ;
      saveFile(md.render(this.state.text) , this.state.text , this.props.settings );
      this.modified = false;
      }}
      ></input>

      <input type="button" id="fullPreview" 
      value=${this.state.action=="preview" ? "Edit" : "Preview"}
      onclick=${()=>{
        
        let ci = document.getElementById("previewIframe");
        
        if(ci){

          ci.remove(); 
          document.body.style.overflow="auto";
          this.setState({action: "edit"}) ;
          return}

        let i = document.createElement("iframe");
          document.body.style.overflow="hidden";
        i.id="previewIframe";
        document.body.appendChild(i);
        this.radicalPreview(i);
        this.setState({action:"preview"})
      }
      }></input>
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
        title=${"Footer"}
        name=${"footer"}
        value=${this.state.footer}
        area=${true}
        handler=${this.makeHandler("footer")}
        />

        <${TheInput} 
        title=${"Custom CSS"}
        name=${"css"}
        area=${true}
        value=${this.state.customCSS}
        handler=${this.makeHandler("customCSS")}
        />

<hr />
<h2 class="subtitle is-3">Advanced </h2>

        <${TheInput} 
        title=${"Custom HTML to HEAD"}
        name=${"head"}
        area=${true}
        value=${this.state.headHTML}
        handler=${this.makeHandler("headHTML")}
        />

        <${TheInput} 
        title=${"Editor location"}
        value=${this.state.editor}
        name=${"editor"}
        area=${false}
        handler=${this.makeHandler("editor")}
        />

        <${TheInput} 
        title=${"View CSS location"}
        value=${this.state.viewCSS}
        name=${"viewcss"}
        area=${false}
        handler=${this.makeHandler("viewCSS")}
        />

        <div class="formRow">
        <input type="button" class="utility button is-gray" value="Switch to view mode" onclick=${()=>window.location="#view"}></input>
        <div class="divider"></div>
        <input type="button" class="utility button is-gray" value="Duplicate file" onclick=${
          ()=>{
               const myfilename = this.props.settings.filename();
               const filename = prompt("Enter new filename with extension" , this.props.settings.filename());
               this.props.settings.filename(filename);
               saveFile( md.render(this.state.text) , this.state.text , this.props.settings );
               this.props.settings.filename(myfilename);
            }
          }></input>
        </div>



      </div>
    </div>`
  }
  updateMdEditor(){

    const easyMDE = new MDE(
      {
        element: this.mdEditorNode.current ,
        syncSideBySidePreviewScroll: false,
        previewRender: (m ,p)=>{   
        return md.render(m) 
        },
        spellChecker: false,
        sideBySideFullscreen: false,
        toolbar: ["bold", "italic", "heading", "|", "quote" ,
        "unordered-list" , "ordered-list" ,  "|" , "link" , "image" , "|",
        "preview" , "side-by-side" , "fullscreen" , "|" , "guide" , "|",
        {
          name: "export",
          action: ()=>{ saveToDisk(this.state.filename.replace(/.htm(l)?$/ , ".md"),
            this.state.text)
          },
          className: "fa fa-download",
          title: "Export markdown"
        },
        {
          name: "import",
          action: ()=>{
             loadFromDisk((t)=>{ easyMDE.value(t);this.setState({text:t}) })
          },
          className: "fa fa-upload",
          title: "Import markdown"
        }

        ]
      });

      easyMDE.value( this.state.text );
      easyMDE.codemirror.on("change" , 
        ()=>{
        this.handleInput("text", easyMDE.value()) 
        } )


        // console.log("MDE" , easyMDE);

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
    const phtml = convert2html(md.render(this.state.text) , "" , this.props.settings , window.savedHead , this.props.viewCSS);
    frame.contentWindow.document.open();
    frame.contentWindow.document.write(phtml);
    frame.contentWindow.document.close();
  }
  componentDidMount(){
  this.updateMdEditor();
  }
  componentWillUpdate(np,ns){
    if(ns.action!=this.state.action){ //switch preview mode
       return;
    }
    
    this.modified = true;
  }
  componentDidUpdate(){
   //update settings
   const s = this.props.settings;
   s.title(this.state.title)
   s.description(this.state.description)
   s.filename(this.state.filename)
   s.css(this.state.customCSS)
   s.image(this.state.image)
   s.footer(this.state.footer)
   s.editor(this.state.editor)
   s.viewCSS(this.state.viewCSS)
   s.headHTML(this.state.headHTML)
   //update customCSS
   document.title = s.title();
   const ccsst = document.querySelector("#customCSS");
   ccsst.innerHTML = this.state.customCSS;
   //editor
  }
}

PageEditor.defaultProps = {
   text: "Test text",
   mode: "md"
}
