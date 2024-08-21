// import "preact/debug";
import { h, render } from "preact";
import { makeSettings, stringifySettings } from "./settings.js";
import { PageEditor } from "./components/PageEditor";
const version = VERSION;

import { extractFromHTML, saveToDisk } from "./fileops.js";

console.info("IMP! editor v" + version);
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
