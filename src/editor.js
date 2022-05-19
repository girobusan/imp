import {h , render, Component , createRef} from "preact";
import {html} from "preact/compat";
import {EasyMDE} from "easymde";
import {create as createSettings} from "./settings.js";
import {PageEditor} from "./components/PageEditor";

import * as fileops from "./fileops.js"

console.log("editor");
let s = fileops.extractFromHTML();
console.log('S' , s);
const settings = createSettings(s.settings);
//remove viewer css
document.querySelector("#viewCSS").remove();


let Editor = h(
  PageEditor,
  {settings: settings , text: s.markdown},
  ""

)

render(Editor, document.body)
