
import {h , Component , createRef ,render} from "preact";
import { useRef } from "preact/hooks";
import {html} from "htm/preact";
import { saveToDisk } from "./fileops.js";
import { renderHTMLFromObj } from "./template.js";
import { cleanupObj } from "./settings.js";
import { extractFM } from "./fm_extractor.js";
var emoji = require('markdown-it-emoji');
const yaml = require('js-yaml');
require("./hatcher.scss");


var md = require('markdown-it')({
  html:true,
  langPrefix: 'language-',
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // use external default escaping
  }
  
  })
.use(emoji )
.use(require('markdown-it-checkbox'))
.use(require('markdown-it-multimd-table') , { 
  headerless: true,
  multiline: true
})

function replaceExt(fn){
  const isExt = /^.+\.\w+$/ig ; 
  if( !fn.match(isExt) ){ return fn + ".html" }
  return fn.replace( /\.[^.]+$/i , ".html"  )
}

function processDrop(ev){
ev.preventDefault();
ev.stopPropagation();
console.log("Something dropped")
  if(ev.dataTransfer.items){
     Array.from( ev.dataTransfer.items ).forEach( 
       (item)=>{
          const f = item.getAsFile();
          console.log(f)
          if(!f.type.startsWith("text/")){ return }
          console.info("Let's convert" , f.name )
          const fname = replaceExt( f.name ) ;
          f.text()
          .then(r=>{
             const h = md2imp(r , fname);
             saveToDisk( fname , h )
          })
          .catch(e=>console.error( fname , e ))
       }
     )
  }else{
    console.info("Something strange dropped")
  }
}

function md2imp(mdtext , fname){
   const parts = extractFM( mdtext );
   const md2html = md.render(parts.markdown);
   let metadata = parts.meta ? yaml.load(parts.meta): {};
   metadata = cleanupObj(metadata);
   metadata.settings = Object.assign( {} , metadata)
   metadata.htmlText = md2html;
   metadata.mdText = parts.markdown; 
   if(fname){ metadata.filename = fname }
   return renderHTMLFromObj(metadata)
}

const Hatcher = function(){
   const zone = createRef();
   return html`
   <div class="HatcherUI">
   <h2>Imp 😈 Hatcher <small>(beta)</small></h2>
   <p>
   Hatcher makes <strong><a href="https://github.com/girobusan/imp">IMP!</a></strong> HTML files from markdown text files.
   </p>
   <p>
   <strong>Note:</strong> you'll need to download <code>imp.js</code> and <code>style.css</code> separately (<a href="https://github.com/girobusan/imp/tree/master/dist">here</a>).
   </p>
   <p>You may read the <a href="https://girobusan.github.io/imp/"><strong>IMP!</strong> docs here.</a></p>
   <div 
   onDrop=${ processDrop }
   onDragOver=${ e=>{ zone.current.classList.add("hover") ; e.stopPropagation() ; e.preventDefault() } }
   onDragLeave=${ e=>{ zone.current.classList.remove("hover") ; e.stopPropagation() ; e.preventDefault() } }
   onDragEnd=${ e=>{ zone.current.classList.remove("hover") ; e.stopPropagation() ; e.preventDefault() } }
   onMouseOut=${ e=>{ zone.current.classList.remove("hover") } }
   class="Hatcher"
   ref=${zone}
   ></div>
   </div>
   `
}

let Ht = h( Hatcher , {} , "" )
render( Ht , document.getElementById("impHatcher") )
