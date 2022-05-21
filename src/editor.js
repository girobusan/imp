import {h , render } from "preact";
import {create as createSettings} from "./settings.js";
import {PageEditor} from "./components/PageEditor";
const version = VERSION;

import * as fileops from "./fileops.js"

console.info("IMP! editor v" + version);
let s = fileops.extractFromHTML();
console.log('Extracted from html' , s);
console.log('Saved in script' , window.settings);
const settings = createSettings(window.settings);
console.log("test settings");
console.log(settings.copy())
console.log(settings.copy(true))
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

document.body.innerHTML="<!--clean up-->";

render(Editor, document.body)
