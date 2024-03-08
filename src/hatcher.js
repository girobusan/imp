
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

function processDrop(ev){
ev.preventDefault();
ev.stopPropagation();
  if(ev.dataTransfer.items){
     Array.from( ev.dataTransfer.items ).forEach( 
       (item)=>{
          const f = item.getAsFile();
          console.log(f)
          if(!f.type.startsWith("text/")){ return }
          console.log("Let's convert" , f.name )
          const fname = f.name + ".html";
          f.text()
          .then(r=>{
             const h = md2imp(r);
             saveToDisk( fname , h )
          })
          .catch(e=>console.error( fname , e ))
       }
     )
  }else{
    console.info("Something strange dropped")
  }
}

function md2imp(mdtext){
   const parts = extractFM( mdtext );
   const md2html = md.render(parts.markdown);
   let metadata = parts.meta ? yaml.load(parts.meta): {};
   metadata = cleanupObj(metadata);
   metadata.settings = Object.assign( {} , metadata)
   metadata.htmlText = md2html;
   metadata.mdText = parts.markdown; 
   return renderHTMLFromObj(metadata)
}

const Hatcher = function(){
   return html`
   <div class="HatcherUI">
   <h2>😈 Hatcher</h2>
   Hatcher makes <strong>IMP!</strong> html from markdown files.
   Note: you'll need to download imp.js and style.css separately.
   <div 
   onDrop=${ processDrop }
   class="Hatcher"
   ></div>
   </div>
   `
}

let Ht = h( Hatcher , {} , "" )
console.log(Ht)
render( Ht , document.body )
