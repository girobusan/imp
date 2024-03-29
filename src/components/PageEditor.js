const version = VERSION ;
import {Component , createRef} from "preact";
import { useRef } from "preact/hooks";
import {html} from "htm/preact";
const yaml = require('js-yaml');
import * as MDE from "easymde";
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
    this.previewIframe;
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
  render(){
    return html`<div class="PageEditor">
    <div id="branding"><strong>IMP!</strong> 😈 ${version}</div>

    <div class="is-mobile" id="mainButtons">


    <input type=button id="exportHTML" value="Save"
    class=${this.state.modified ? "modified" : "not-modified"}
    onclick=${()=>{
      console.log("export requested...") ;
      saveFile(md.render(this.state.text) , this.state.text , this.props.settings );
      this.setState({modified: false})
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
        i.name="IMPPreviewIframe";
        document.body.style.overflow="hidden";
        i.id="previewIframe";
        document.body.appendChild(i);
        this.radicalPreview(i);
        this.setState({action:"preview"})
        }
        }></input>
        </div>


        <div class="workZone ${this.state.modified ? 'modified' : 'still'}">

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
          const me = this;

          const easyMDE = new MDE(
            {
              element: this.mdEditorNode.current ,
              syncSideBySidePreviewScroll: false,
              autoDownloadFontAwesome: false,
              previewRender: (m ,p)=>{   
                // EVERYTHING DOWN BELOW
                // IS NOT MY FAULT
                // EasyMDE forced me
                // to do this
                //
                // make external listener
                if(!window.embedListener){
                  window.embedListener = function(){
                    const pviews = document.querySelectorAll(".embeddedPreviewIframe");
                    pviews.forEach(f=>{ me.radicalPreview(f, window.currentEditorText) })

                  }
                }
                // window.pframeText = m;
                var ifrm = p.querySelector(".embeddedPreviewIframe");
                // console.log("ifrm" , ifrm);
                window.currentEditorText = m;
                if(p.classList.contains("editor-preview-full") || !ifrm){
                   
                   return `<iframe 
                   name="IMPPreviewIframe"
                   class="embeddedPreviewIframe"
                   onload="embedListener()"
                   ></iframe>`
                }else{
                 me.radicalPreview(ifrm, m)
                }
                 // return ifrm;
              },
              spellChecker: false,
              sideBySideFullscreen: false,
              toolbar: ["bold", "italic", "strikethrough",
              "heading", "|", "quote" ,
                "unordered-list" , "ordered-list" ,  "|" , "link" , "image" , "|",
                "preview" , "side-by-side" , "fullscreen" , "|" ,
                {
                  name: "save",
                  action: ()=>{ 
      console.log("export requested...") ;
      saveFile(md.render(me.state.text) , me.state.text , me.props.settings );
      me.modified = false;
      me.setState({modified: false});

                  
                  },
                  className: "fa fa-floppy-o toolbarSaveButton no-disable",
                  id: "editorSaveButton",
                  title: "Save HTML"
                },
                {
                  name: "export",
                  action: ()=>{ 
                      //export settings
                      const st = this.props.settings.dump();
                      saveToDisk(this.state.filename.replace(/.htm(l)?$/ , ".md"),
                      "---\n" + st + "\n---\n" + this.state.text)
                  },
                  className: "fa fa-download no-disable",
                  title: "Export markdown"
                },
                {
                  name: "import",
                  action: ()=>{
                    loadFromDisk((t)=>{
                      const extracted = extractFM(t)
                      easyMDE.value(extracted.markdown);
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
                  },
                  className: "fa fa-upload",
                  title: "Import markdown"
                },
              "|", "guide" , 

              ]
            });

            easyMDE.value( this.state.text );
            easyMDE.codemirror.on("change" , 
              ()=>{
                this.handleInput("text", easyMDE.value()) 
              } )


              // console.log("MDE" , easyMDE);

        }
        radicalPreview(frame , txt){
          const phtml = convert2html(md.render(txt || this.state.text) , "" , this.props.settings , true);
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

