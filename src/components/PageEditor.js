const version = VERSION ;
import {Component , createRef} from "preact";
import { useRef } from "preact/hooks";
import {html} from "htm/preact";
const yaml = require('js-yaml');
import BareMDE from "../BareMDE_v0.2.1.js";
import { md } from "../md_wrapper.js";
import { If } from "./If";
import {saveFile, saveToDisk , loadFromDisk, convert2html} from "../fileops.js";
import { cleanupObj } from "../settings";
import { extractFM } from "../fm_extractor.js";
require("./editor.scss")
require("easymde/dist/easymde.min.css");
import impIcon from "../icons/imp.svg?raw";

function TheInput(props){
  const inp = useRef(null);
  const onChange = ()=>{props.handler(inp.current.value)};

  return html`<div class="TheInput">
  <label class="label" for=${props.name || "" }>${props.title}</label>
  <${If} condition=${props.area==true}>
  <textarea ref=${inp} 
  style="min-height: 100px;transition:height .5s"
  class=${"input biginout area"+props.name}
  name=${props.name || ""} 
  onfocus=${(e)=>{
     const bh = e.target.getBoundingClientRect().height;
     const sh = e.target.scrollHeight;
     if(sh>bh){
       e.target.style.height=(sh+16)+"px"
       }
    }}
  onblur=${ (e)=>e.target.style.height="100px" }
  onkeyup=${(e)=>{ 
     const bh = e.target.getBoundingClientRect().height;
     const sh = e.target.scrollHeight;
     if(sh>bh){
       e.target.style.height=(sh+16)+"px"
     }
     onChange()
    }}
  onchange=${(e)=>{ onChange(); }} >
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
    this.state = {
      text: props.text,
      action: "edit",
      title: props.settings.title() || "",
      image: props.settings.image() || "",
      icon: props.settings.icon() || "",
      filename: props.settings.filename() || "",
      description: props.settings.description() || "",
      footer: props.settings.footer() || "",
      customCSS: this.findCustomCSS(),
      editor: props.settings.editor() || "",
      viewCSS: props.settings.viewCSS() || "",
      headHTML: props.settings.headHTML() || "",
      author: props.settings.author() || "",
      keywords: props.settings.keywords() || "",
      modified: false
    }
    this.text=props.text;
    this.handleInput = this.handleInput.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.saveHTML = this.saveHTML.bind(this);
    this.exportMd = this.exportMd.bind(this);
    this.importMd = this.importMd.bind(this);

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
    const ns = {};
    //do not update text in state
    //keep copy
    if(f!=='text'){ ns[f]=v }else{ this.text=v };
    ns.modified = true;
    // console.log("NS" , ns);
    this.setState(ns);
  }
  makeHandler(f){
    const func =  (v)=>this.handleInput(f,v)
    func.bind(this);
    return func;
  }
  handleDrop(e){
    console.log("Drop event found" , e);
    e.preventDefault();
    e.stopPropagation();
    if(e.dataTransfer.items){
      console.log("I see files");
      const f = e.dataTransfer.items[0].getAsFile();
      console.log(f);
      if(f.name.endsWith(".md") || f.name.endsWith(".markdown")){
         f.text().then(t=>this.importMdText(t)) 
      }
    }
  }
  handleDragOver(e){
    // console.log("Drop event found" , e);
    e.preventDefault();
    e.stopPropagation();
  }
  //service 
  saveHTML(){
    // console.log("save requested..." , this) ;
    saveFile(md.render(this.state.text) , this.state.text , this.props.settings );
    this.modified = false;
    this.setState({modified: false});
  }

  importMdText(t){
    const extracted = extractFM(t)
    // set editor content
    // easyMDE.value(extracted.markdown);
    let newState = {text:extracted.markdown}
    this.text=extracted.markdown;
    if(extracted.meta){
      try{
        newState = Object.assign(
          newState , 
          cleanupObj( yaml.load( extracted.meta ) , true )
        )
        newState.text=extracted.markdown;
      }catch ( e ){
        console.error(e);
      }
    }

    this.setState( newState ) 

  }
  importMd(){
    loadFromDisk((t)=>this.importMdText(t))
  }
  exportMd(){
 
    //export settings
    const st = this.props.settings.dump();
    saveToDisk(this.state.filename.replace(/.htm(l)?$/ , ".md"),
    "---\n" + st + "\n---\n" + this.text)
                  
  }
  render(){
    return html`<div class="PageEditor">
    <!--markdown editor-->
    <div class="editor_ui">
    <${ BareMDE } 
    content=${ this.state.text }
    onUpdate=${ (c)=>this.handleInput( "text" , c ) }
    modified=${ this.state.modified }
    save=${ this.saveHTML }
    maxHeight="100%"
    branding=${ "<div class='IMPBrand' style='line-height:38px'>IMP!  " + impIcon + version + "</div>" }
    trueFullscreen=${true}
    render=${
      (c)=>{ return convert2html(md.render(c) , "" , this.props.settings , true) }
      }
      menuItems=${[
       { label:"Import markdown &larr;" , handler:this.importMd },
       { label:"Export markdown &rarr;" , handler:this.exportMd },
        ]}
      />

      </div>

    <div class="main_ui ${this.state.modified ? 'modified' : 'still'}">

        <h2 class="subtitle is-3">Page settings </h2>
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
        title=${"Author"}
        value=${this.state.author}
        name=${"author"}
        area=${false}
        handler=${this.makeHandler("author")}
        />
        <div class="divider"></div>
        <${TheInput} 
        title=${"Keywords"}
        value=${this.state.keywords}
        name=${"keywords"}
        area=${false}
        handler=${this.makeHandler("keywords")}
        />
        </div>
        

        <${TheInput} 
        title=${"Description"}
        name=${"description"}
        value=${this.state.description}
        area=${true}
        handler=${this.makeHandler("description")}
        />

        <div class="formRow">

        <${TheInput} 
        title=${"Preview image URL"}
        value=${this.state.image}
        name=${"image"}
        area=${false}
        handler=${this.makeHandler("image")}
        />
        <div class="divider"></div>
        <${TheInput} 
        title=${"Icon image URL"}
        value=${this.state.icon}
        name=${"icon"}
        area=${false}
        handler=${this.makeHandler("icon")}
        />
        </div>

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
        <input type="button" class="utility button is-gray" value="Switch to view mode" onclick=${()=>{
          if(this.state.modified)
          { 
            confirm("All changes may be lost. Proceed?") && ( window.location="?mode=view" ) 
          }else{
            window.location="?mode=view"
            }
           }}></input>
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
          console.error("wrong function called")
        }
        componentDidMount(){
          document.addEventListener("drop", this.handleDrop)
          document.addEventListener("dragover", this.handleDragOver)
        }
        componentWillUnmount(){

          document.removeEventListener("drop", this.handleDrop)

          document.removeEventListener("dragover", this.handleDragOver)
        }
        componentWillUpdate(np,ns){
          // this.text = ns.text;
          if(ns.action!=this.state.action){ //switch preview mode
            return;
          }

        }
        componentDidUpdate(){
          //update settings
          //
          this.props.settings
          .title(this.state.title)
          .description(this.state.description)
          .filename(this.state.filename)
          .css(this.state.customCSS)
          .image(this.state.image)
          .icon(this.state.icon)
          .footer(this.state.footer)
          .editor(this.state.editor)
          .viewCSS(this.state.viewCSS)
          .headHTML(this.state.headHTML)
          .author(this.state.author)
          .keywords(this.state.keywords)
          //update some current HTML
          document.title = this.state.title;
          
          console.log(this.state);
          // const ccsst = document.querySelector("#customCSS");
          // if(ccsst){
          //   ccsst.innerHTML = this.state.customCSS;
          // }
        }
      }

