import {h , render, Component , createRef} from "preact";
import {html} from "preact/compat";
import {EasyMDE} from "easymde";
import {create as createSettings} from "./settings.js";
import {PageEditor} from "./components/PageEditor";

import * as fileops from "./fileops.js"

console.log("editor");
let s = fileops.extractFromHTML();
console.log('S' , s);
const settings = createSettings(window.settings);
//remove viewer css
const viewcss= document.querySelector("#viewCSS").remove();
if(viewcss){viewcss.remove()}



let Editor = h(
  PageEditor,
  {settings: settings , text: s.markdown},
  ""

)

render(Editor, document.body)
