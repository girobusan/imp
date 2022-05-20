import {h , render, Component , createRef} from "preact";
import {html} from "preact/compat";
import {EasyMDE} from "easymde";
import {create as createSettings} from "./settings.js";
import {PageEditor} from "./components/PageEditor";

import * as fileops from "./fileops.js"

console.info("Editor loading...");
let s = fileops.extractFromHTML();
console.log('Extracted from html' , s);
console.log('Saved in script' , window.settings);
const settings = createSettings(window.settings);
//remove viewer css
const viewcss= document.querySelector("#viewCSS");
if(viewcss) {
  viewcss.remove();
}

let Editor = h(
  PageEditor,
  {settings: settings , text: s.markdown },
  ""

)


render(Editor, document.body)
