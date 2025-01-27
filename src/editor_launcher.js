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
    window.location.search.indexOf("mode=edit") === -1
  ) {
    document.getElementById("editorScript").remove();
    console.info("Do not force editor if file loaded locally.");
    // add edit button
    const ebutton = document.createElement("button");
    ebutton.innerHTML = editIcon;
    ebutton.title = "Edit page";
    ebutton.setAttribute(
      "style",
      `position:fixed; box-sizing: border-box; display: block; width: 32px; 
height: 32px; right: 18px ; top: 18px ; padding: 4px ; padding-top: 3px`,
    );
    ebutton.addEventListener("click", () => (window.location = "?mode=edit"));
    document.body.appendChild(ebutton);
    // exit
    return;
  }

  const s = extractFromHTML();
  const settings = makeSettings(window.settings);

  if (window.location.search.indexOf("mode=download") == -1) {
    const viewcss = document.head.querySelector("#viewCSS");
    const customcss = document.head.querySelector("#customCSS");
    viewcss && viewcss.remove();
    customcss && customcss.remove();

    document.body.innerHTML = "";
    render(
      h(PageEditor, { settings: settings, text: s.markdown }, ""),
      document.body,
    );
  } else {
    console.info("Download function is quirky!");
    const fcontent =
      "---\n" + stringifySettings(settings, true) + "---\n" + s.markdown;
    window.location = "?mode=view";
    saveToDisk(settings.filename.replace(/\.htm(l)?$/, "") + ".md", fcontent);
  }
})();
