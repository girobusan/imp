const version = VERSION ;
import {Component , createRef , h} from "preact";
import {html} from "htm/preact";
const yaml = require('js-yaml');
import BareMDE from "../BareMDE_v0.2.4.umd.js";
import SettingsEditor from "./SettingsEditor.js";
import Tabbed from "./Tabbed.js";
import TabPage from "./TabPage.js";
import { md , renderMdAsync} from "../md_wrapper.js";
import {saveFile, saveToDisk , loadFromDisk, convert2html} from "../fileops.js";
import { addEmpties, cleanupObj } from "../settings";
import { extractFM } from "../fm_extractor.js";
require("./editor.scss")
import impIcon from "../icons/imp.svg?raw";
require( "../data_fetch.js" )
// import { attachScript } from "../helpers.js";

const branding=( "<div class='IMPBrand' style='line-height:24px'>IMP!  " + impIcon + version + "</div>" )


const mdRx = /\.(md|markdown|mkd|mdwn|mdtxt|mdtext|txt|text)$/i

export class PageEditor extends Component{
  constructor(props){
    super(props);
    // console.log("one")
    this.editorNode = createRef();
    this.resizer = createRef();
    // console.log(props.settings.enableHelpers());
    // console.log(JSON.parse( props.settings.enableHelpers() || "false" ));
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
      disableInteractivity: props.settings.disableInteractivity() || false,
      modified: false,
      enableHelpers: props.settings.enableHelpers()|| false  ,
      _tabSelected: 0
    }
    this.text=props.text;
    this.editorControls = {};
    this.editorHeight = Math.round( window.innerHeight * 0.75 );
    this.resizeValue = null;
    this.makeHandler = this.makeHandler.bind(this);
    // this.startResize = this.startResize.bind(this);
    // this.stopResize = this.stopResize.bind(this);
    // this.doResize = this.doResize.bind(this);
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
    if(e && e.innerHTML.trim()){
      return e.innerHTML;
    }
    return "";
  }
  //resize
  handleInput(f,v){
    const ns = {};
    //do not update text in state
    //keep copy
    if(f!=='text'){ ns[f]=v }else{ this.text=v };
    ( !ns.modified ) && ( ns.modified = true );
    this.setState(ns);
    if( ["headHTML" , "customCSS"].indexOf(f)!=-1 ){
      try{
        this.editorControls.refreshPreview();
      }catch(e){
        console.info("Editor controls malfunction:" , e)
      }
    }
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
  duplicateFile(){
    const s = this.makeSettings(); //sync settings
    const thisfilename = s.filename();
    const newfilename = prompt("Enter new filename with extension" , 
      s.filename());
    s.filename(newfilename);
    saveFile( md.render(this.text) , this.text , s );
    s.filename( thisfilename )
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
    .enableHelpers(this.state.enableHelpers)
    .disableInteractivity(this.state.disableInteractivity)
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

  componentDidUpdate(){
    //update some current HTML
    document.title = this.state.title;
    if(this.state.enableHelpers && 
      !window.impHelpers
      ){
       console.log("Attach helpers script");
       // attachScript( "helpers.js" , "helpersScript")
      const s =  document.createElement("script");
      s.id="helpersScript";
      document.head.appendChild(s);
      s.src="helpers.js"

    }
    if(!this.state.enableHelpers && 
      window.impHelpers
      ){
       console.log("Detach helpers module");
      document.head.querySelector("script#helpersScript").remove();
      delete window.impHelpers
    }

  }
  render(){
    return html`<div class="PageEditor">
<!--markdown editor-->
<${ Tabbed } selectFn=${ i=>this.setState({"_tabSelected" : i})}
selected=${this.state[ "_tabSelected"]}
tabs=${[
   { title: "Content" , customClass:"contentEditorTab" } , 
   { title: "Page Settings", customClass:"pageSettingsTab" },
   { title: "View Mode", 
     customClass:"viewModeTab" , 
     action:()=>{ 
        confirm("All unsaved changes may be lost. Continue?")&&(window.location="?mode=view") } 
}
]}
branding=${branding}
}/>
<${TabPage} title="Text" 
index=${0} selectedIndex=${this.state._tabSelected} >
<div class="editor_ui" 
ref=${this.editorNode}
>
<${ BareMDE } 
controls=${this.editorControls}
content=${ this.state.text }
onUpdate=${ (c)=>this.handleInput( "text" , c ) }
modified=${ this.state.modified }
save=${ this.saveHTML }
maxHeight="100%"
branding=${" "}
trueFullscreen=${true}
renderBody=${
(c)=>{ 
return renderMdAsync(c , true)
.then( r=>{
return `<main class="container" id="pageMain">${r}</main><footer id="pageFooter">${this.state.footer}</footer>`;
})
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
</div>
</${TabPage}>

<${TabPage} title="Settings" index=${1} selectedIndex=${this.state._tabSelected} >
<${ SettingsEditor } 
makeHandler=${this.makeHandler}
modified=${this.state.modified}
setModified=${ ()=>this.setState({modified:true})}
saveHTML=${this.saveHTML}
duplicateFile=${this.duplicateFile}
filename=${this.state.filename}
title=${this.state.title}
author=${this.state.author}
keywords=${this.state.keywords}
description=${this.state.description}
image=${this.state.image}
icon=${this.state.icon}
footer=${this.state.footer}
customCSS=${this.state.customCSS}
headHTML=${this.state.headHTML}
enableHelpers=${this.state.enableHelpers}
disableInteractivity=${this.state.disableInteractivity}
viewCSS=${this.state.viewCSS}
editor=${this.state.editor}
/>
</${TabPage}>
</div>`
  }//render
}

