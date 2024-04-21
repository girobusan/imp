
import {renderHTML} from "./template.js";

const tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

const replaceToTags = {
  '&amp;':'&',
  '&lt;': '<',
  '&gt;': '>'
}

export function escapeTags(s){
  s=s.toString();
  const replacer=(tag)=>{return tagsToReplace[tag]||tag}
  return s.replace(/[&<>]/g , replacer);
}
export function unescapeTags(s){
  s=s.toString();
  const replacer=(tag)=>{return replaceToTags[tag]||tag}
  return s.replace(/&amp;|&lt;|&gt;/g , replacer);
}

export function convert2html(
  text, 
  mdtext , 
  settings, //object
  noScript
)
{

  //current custom CSS
  const currentCSS = document.querySelector("#customCSS");

  return renderHTML(
    text,
    mdtext,
    settings.footer(),
    settings.title(),
    settings.description(),
    settings.image(),
    settings.icon(),
    settings.css(),
    // currentCSS ? currentCSS.innerHTML :  "",
    settings.headHTML(),
    settings.copy(true),
    settings.editor(),
    settings.viewCSS(),
    settings.author(),
    settings.keywords(),
    settings.enableHelpers(),
    noScript

  )
  ;
  /*
  */
}

export function extractFromHTML(){
  const dataContainer = document.querySelector("script#pageData");
  if(!dataContainer){ 

    console.info("It is empty document");
    return { markdown: ""}
  }
  if(dataContainer.type=="text/markdown"){
    return {markdown: unescapeTags(dataContainer.innerHTML).trim() }
  }
  return JSON.parse(unescapeTags( dataContainer.innerHTML ));
}

export function saveFile(text, mdtext, settings){
  // console.log("save with" , settings.copy());
  const fn = settings.filename();
  const content = convert2html(text, mdtext, settings);
  saveToDisk(fn, content);

}

export function saveToDisk(name,content){
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', name);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

}


export function loadFromDisk(callback){
  var element = document.createElement("input");
  var filename;
  element.setAttribute("type", "file");
  element.addEventListener("change" , function(){
    filename = element.files[0].name;
    console.log("name" , filename)
    element.files[0]
    .text()
    .then(r=>callback(r , filename))
  });
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);


}
