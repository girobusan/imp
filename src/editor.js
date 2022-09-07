import {h , render } from "preact";
import {create as createSettings} from "./settings.js";
import {PageEditor} from "./components/PageEditor";
const version = VERSION;

import * as fileops from "./fileops.js"


// if(window.location.hash!=="#md"){
  console.info("IMP! editor v" + version);
  let s = fileops.extractFromHTML();
  const settings = createSettings(window.settings);
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
// }
