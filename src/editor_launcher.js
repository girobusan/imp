// import "preact/debug";
import {h , render } from "preact";
import {create as createSettings} from "./settings.js";
import {PageEditor} from "./components/PageEditor";
const version = VERSION;

import {extractFromHTML , saveToDisk} from "./fileops.js"

console.info("IMP! editor v" + version);
const s = extractFromHTML();
const settings = createSettings(window.settings);

if(window.location.search.indexOf("mode=download")==-1){
  const viewcss= document.head.querySelector("#viewCSS");
  const customcss= document.head.querySelector("#customCSS");
  viewcss && viewcss.remove();
  customcss && customcss.remove();

  const Editor = h(
    PageEditor,
    {settings: settings , text: s.markdown },
    ""
  )

  document.body.innerHTML="";
  render(Editor, document.body)
}else{
  console.info("Download function is quirky!")
  const fcontent = "---\n" + settings.dump()+"---\n" + s.markdown ;
  window.location = "?mode=view"
  saveToDisk( settings.filename().replace(/\.htm(l)?$/ , "") + ".md" , fcontent )

}
