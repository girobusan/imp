import { renderHTML } from "./template.js";
import { unescapeTags } from "./util.js";

export function extractFromHTML() {
  const dataContainer = document.querySelector("script#pageData");
  if (!dataContainer) {
    console.info("It is empty document");
    return { markdown: "" };
  }
  if (dataContainer.type == "text/markdown") {
    return { markdown: unescapeTags(dataContainer.innerText).trim() };
  }
  return JSON.parse(unescapeTags(dataContainer.innerText));
}

export function saveFile(text, mdtext, settings) {
  // console.log("save with" , settings.copy());
  const fn = settings.filename;
  const content = renderHTML(text, mdtext, settings);
  saveToDisk(fn, content);
}

export function saveToDisk(name, content) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(content),
  );
  element.setAttribute("download", name);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function loadFromDisk(callback) {
  var element = document.createElement("input");
  var filename;
  element.setAttribute("type", "file");
  element.addEventListener("change", function() {
    filename = element.files[0].name;
    console.log("name", filename);
    element.files[0].text().then((r) => callback(r, filename));
  });
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
