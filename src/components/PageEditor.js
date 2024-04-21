const version = VERSION ;
import {Component , createRef , h} from "preact";
import {html} from "htm/preact";
const yaml = require('js-yaml');
import BareMDE from "../BareMDE_v0.2.3.umd.js";
import { md , renderMd , renderMdAsync} from "../md_wrapper.js";
import {saveFile, saveToDisk , loadFromDisk, convert2html} from "../fileops.js";
import { addEmpties, cleanupObj } from "../settings";
import { extractFM } from "../fm_extractor.js";
require("./editor.scss")
import impIcon from "../icons/imp.svg?raw";
import TheInput from "./TheInput.js";


const mdRx = /\.(md|markdown|mkd|mdwn|mdtxt|mdtext|txt|text)$/i

export class PageEditor extends Component{
  constructor(props){
    super(props);
    // console.log("one")
    this.editorNode = createRef();
    this.resizer = createRef();
    this.state = {
      text: props.text,
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
    this.editorControls = {};
    this.editorHeight = Math.round( window.innerHeight * 0.75 );
    this.resizeValue = null;
    this.startResize = this.startResize.bind(this);
    this.stopResize = this.stopResize.bind(this);
    this.doResize = this.doResize.bind(this);
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
  //resize
  startResize(evt){
    // console.log("start resize");
    // evt.preventDefault();
    // evt.stopPropagation();
    window.addEventListener("mouseup", this.stopResize)
    window.addEventListener("click", this.stopResize)
    window.addEventListener("mousemove", this.doResize)
    this.resizer.current.removeEventListener("mousedown" , this.startResize)
    this.resizeValue = evt.clientY 
  }
  doResize(evt){
    // console.log("resizing...")
    const delta = evt.clientY - this.resizeValue;
    if(Math.abs(delta)<=2){ return }
    this.editorHeight += delta;
    if(this.editorHeight<=200){ this.editorHeight=200 ; this.stopResize() }
    this.resizeValue = evt.clientY;
    this.editorNode.current.style.height = this.editorHeight + "px";
    // console.log(delta);
  }
  stopResize(){
    console.log("resized:" , this.editorHeight)
    window.removeEventListener("mouseup", this.stopResize)
    window.removeEventListener("click", this.stopResize)
    window.removeEventListener("mousemove", this.doResize)
    this.resizer.current.addEventListener("mousedown" , this.startResize)
    this.editorControls.syncScroll();
  }
  handleInput(f,v){
    const ns = {};
    //do not update text in state
    //keep copy
    if(f!=='text'){ ns[f]=v }else{ this.text=v };
    ( !ns.modified ) && ( ns.modified = true );
    this.setState(ns);
  }
  makeHandler(f){
    const func =  (v)=>this.handleInput(f,v)
    func.bind(this);
    return func;
  }
  handleDrop(e){
    // console.log("Drop event found" , e);
    e.preventDefault();
    e.stopPropagation();
    if(e.dataTransfer.items){
      console.log("I see file");
      const f = e.dataTransfer.items[0].getAsFile();
      // console.log(f);
      if(mdRx.test(f.name) && f.type.startsWith("text/")){
        f.text().then(t=>{ 
          confirm("Looks like markdown file. Do you want to import it?") && 
          this.importMdText(t , f.name.replace(mdRx , ".html")) }) 
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
    // saveFile(renderMd(this.text , false) , this.text , this.makeSettings() );

    renderMdAsync( this.text , false )
    .then( r=>{
      saveFile( r , this.text , this.makeSettings() ) ;
      this.modified = false;
      this.setState({modified: false});
    } )

  }

  importMdText(t , name){
    const extracted = extractFM(t)
    let newState = {
      text:extracted.markdown,
      footer : "Powered by <a href='https://github.com/girobusan/imp'><strong>IMP!</strong></a>",
      filename: name || 'index.html'
      }
    this.text=extracted.markdown;

    if(extracted.meta){
      try{
        newState = Object.assign(
          newState , 
          cleanupObj( yaml.load( extracted.meta ) , true )
        )
      }catch ( e ){
        console.error("Can not parse metadata:" , e);
      }
    }
    newState = addEmpties(newState);
    this.setState( newState ) 
  }

  importMd(){
    loadFromDisk((t,n)=>this.importMdText(t , n.replace(mdRx , ".html")))
  }

  exportMd(){
    //export settings
    const st = this.makeSettings().dump();
    saveToDisk(this.state.filename.replace(/.htm(l)?$/i , ".md"),
    "---\n" + st + "---\n" + this.text)
  }

  makeSettings(){
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
    ;
    return this.props.settings;
  }

  componentDidMount(){
    document.body.addEventListener("drop", this.handleDrop)
    document.body.addEventListener("dragover", this.handleDragOver)
  }
  componentWillUnmount(){
    document.body.removeEventListener("drop", this.handleDrop)
    document.body.removeEventListener("dragover", this.handleDragOver)
  }

  // componentWillUpdate(np,ns){
    //   // this.text = ns.text;
    //   if(ns.action!=this.state.action){ //switch preview mode
      //     return;
      //   }

      // }
      componentDidUpdate(){
        //update settings
        // this.props.settings
        // .title(this.state.title)
        // .description(this.state.description)
        // .filename(this.state.filename)
        // .css(this.state.customCSS)
        // .image(this.state.image)
        // .icon(this.state.icon)
        // .footer(this.state.footer)
        // .editor(this.state.editor)
        // .viewCSS(this.state.viewCSS)
        // .headHTML(this.state.headHTML)
        // .author(this.state.author)
        // .keywords(this.state.keywords)
        //update some current HTML
        document.title = this.state.title;

        // console.log(this.state);
      }
      render(){
        return html`<div class="PageEditor">
        <!--markdown editor-->
        <div class="editor_ui" 
        ref=${this.editorNode}
        style=${{ height: this.editorHeight + 'px' }}
        >
        <${ BareMDE } 
        controls=${this.editorControls}
        content=${ this.state.text }
        onUpdate=${ (c)=>this.handleInput( "text" , c ) }
        modified=${ this.state.modified }
        save=${ this.saveHTML }
        maxHeight="100%"
        branding=${ "<div class='IMPBrand' style='line-height:38px'>IMP!  " + impIcon + version + "</div>" }
        trueFullscreen=${true}
        renderBody=${
          (c)=>{ 
            return renderMdAsync(c , true)
            .then( r=>{
              return `<main class="container" id="pageMain">${r}</main><footer id="pageFooter">${this.state.footer}</footer>`;
              } )
          }
          }
        render=${
          (c)=>{ 
            return renderMdAsync(c , true)
            .then( r=>{
              return convert2html( r , "" , this.makeSettings() , true) 
              } )
          }
          }
          menuItems=${[
            { label:"Import markdown &larr;" , handler:this.importMd },
            { label:"Export markdown &rarr;" , handler:this.exportMd },
            ]}
            />
            <div id="resizeHandle" 
            ref=${this.resizer}
            onmousedown=${ this.startResize }
            onmouseup=${ this.stopResize }
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
            <div class="divider" />
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

            <h2 class="subtitle is-3">Advanced (may break everything) </h2>

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
            <input type="button" class="utility button is-gray violet" value="Switch to view mode" onclick=${()=>{
              if(this.state.modified)
              { 
                confirm("All changes may be lost. Proceed?") && ( window.location="?mode=view" ) 
              }else{
                window.location="?mode=view"
                }
                }}></input>
                <div class="divider"></div>
                <input type="button" class="utility button is-gray violet" value="Duplicate file" onclick=${
                  ()=>{
                    const s = this.makeSettings(); //sync settings
                    const thisfilename = s.filename();
                    const newfilename = prompt("Enter new filename with extension" , s.filename());
                    s.filename(newfilename);
                    saveFile( md.render(this.text) , this.text , s );
                    s.filename( thisfilename )
                  }
                  }></input>
                  </div>
                  </div>
                  </div>`
                }//render

                updateMdEditor(){
                  console.error("wrong function called")
                }
            }

