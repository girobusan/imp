const version = VERSION ;
import {Component , createRef} from "preact";
import { useRef } from "preact/hooks";
import {html} from "htm/preact";
const yaml = require('js-yaml');
import * as MDE from "easymde";
import BareMDE from "../BareMDE_v0.2.0.js";
import { md } from "../md_wrapper.js";
import { If } from "./If";
import {saveFile, saveToDisk , loadFromDisk, convert2html} from "../fileops.js";
import { cleanupObj } from "../settings";
import { extractFM } from "../fm_extractor.js";
require("./editor.scss")
require("easymde/dist/easymde.min.css");

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
    this.radicalPreview = this.radicalPreview.bind(this);
    this.saveHTML = this.saveHTML.bind(this);
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
    ns[f]=v;
    ns.modified = true;
    this.setState(ns);
  }
  makeHandler(f){
    const func =  (v)=>this.handleInput(f,v)
    func.bind(this);
    return func;
  }
  //service 
  saveHTML(){
    console.log("save requested..." , this) ;
    saveFile(md.render(this.state.text) , this.state.text , this.props.settings );
    this.modified = false;
    this.setState({modified: false});
  }
  importMd(){
    loadFromDisk((t)=>{
      const extracted = extractFM(t)
      // set editor content
      // easyMDE.value(extracted.markdown);
      let newState = {text:extracted.markdown}
      if(extracted.meta){
        try{
          newState = Object.assign(
            newState , 
            cleanupObj( yaml.load( extracted.meta ) , true )
          )
        }catch ( e ){
          console.error(e);
        }
      }

      this.setState( newState ) })
 
  }
  exportMd(){
 
    //export settings
    const st = this.props.settings.dump();
    saveToDisk(this.state.filename.replace(/.htm(l)?$/ , ".md"),
    "---\n" + st + "\n---\n" + this.state.text)
                  
  }
  render(){
    return html`<div class="PageEditor">
    <div id="branding"><strong>IMP!</strong> 😈 ${version}</div>




    <!--markdown editor-->

    <div class="editor_ui">
    <${ BareMDE } 
    content=${ this.props.text }
    onUpdate=${ (c)=>this.handleInput( "text" , c ) }
    modified=${ this.state.modified }
    save=${ this.saveHTML }
    maxHeight="100%"
    trueFullscreen=${true}
    render=${
      ()=>{ return convert2html(md.render(this.state.text) , "" , this.props.settings , true) }
      }
      />
      </div>

    <div class="main_ui ${this.state.modified ? 'modified' : 'still'}">
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
        radicalPreview(frame , txt){
          const phtml = convert2html(md.render(txt || this.state.text) , "" , this.props.settings);
          frame.contentWindow.document.open();

          frame.contentWindow.document.write(phtml);
          frame.contentWindow.document.close();
        }
        componentDidMount(){
        }
        componentWillUpdate(np,ns){
          if(ns.action!=this.state.action){ //switch preview mode
            return;
          }

        }
        componentDidUpdate(){
          //update settings
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
          // const ccsst = document.querySelector("#customCSS");
          // if(ccsst){
          //   ccsst.innerHTML = this.state.customCSS;
          // }
        }
      }

