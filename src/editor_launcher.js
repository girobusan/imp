// import "preact/debug";
import { h, render } from "preact";
import { makeSettings, stringifySettings } from "./settings.js";
import { PageEditor } from "./components/PageEditor";
const version = VERSION;

import { extractFromHTML, saveToDisk } from "./fileops.js";
import editIcon from "../src/icons/edit_24dp_E8EAED_FILL0_wght500_GRAD0_opsz24.svg?raw";

(() => {
  console.info("IMP! editor v" + version);
  if (
    !window.settings.forceEditorIfLocal &&
    window.location.search.toLowerCase().indexOf("mode=edit") === -1
  ) {
    document.getElementById("editorScript").remove();
    console.info("Do not force editor if file loaded locally.");
    // add edit button
    const ebutton = document.createElement("button");
    ebutton.innerHTML = editIcon;
    ebutton.title = "Edit page";
    ebutton.setAttribute(
      "style",
      `position:fixed; z-index: 100000 ; box-sizing: border-box; display: block; width: 32px; 
height: 32px; right: 18px ; top: 18px ; padding: 4px ; padding-top: 3px`,
    );
    ebutton.addEventListener("click", () => (window.location = "?mode=edit"));
    document.body.appendChild(ebutton);
    // exit
    return;
  }

  function editorLoader() {
    //get source
    const s = extractFromHTML();
    const settings = makeSettings(window.settings);
    //find asssets
    const viewcss = document.head.querySelector("#viewCSS");
    const customcss = document.head.querySelector("#customCSS");
    //remove older links
    viewcss && viewcss.remove();
    customcss && customcss.remove();
    //clean up body
    document.body.innerHTML = "";
    //mount component
    render(
      h(PageEditor, { settings: settings, text: s.markdown }, ""),
      document.body,
    );
  }
  // chrome makes strange things with deferred script
  // do defer manually
  if (window.document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", editorLoader);
  } else {
    editorLoader();
  }

  // maybe, one day...↓

  // console.info("Download function is quirky!");
  // const fcontent =
  //   "---\n" + stringifySettings(settings, true) + "---\n" + s.markdown;
  // window.location = "?mode=view";
  // saveToDisk(settings.filename.replace(/\.htm(l)?$/, "") + ".md", fcontent);
  //
})();
