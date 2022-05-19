
export function convert2html(text, mdtext , settings,headHTML){

 let newDoc = document.implementation.createHTMLDocument("");

 newDoc.head.innerHTML = headHTML;
 
 //title
 newDoc.title = settings.title || "";
 const metaOgTitle = newDoc.querySelector("meta[name='og:title']");
 if(metaOgTitle){ metaOgTitle.content = settings.title || ""}
 //description
 const metaDescription = newDoc.querySelector("meta[name='description']");
 if(metaDescription){ metaDescription.content = settings.description || "" }
 const metaOgDescription = newDoc.querySelector("meta[name='og:description']");
 if(metaOgDescription){ metaOgDescription.content = settings.description || "" }

 //image
 const metaOgImage = newDoc.querySelector("meta[name='og:image']");
 if(metaOgImage){ metaOgImage.content=settings.image || "" }
 const twitterImage = newDoc.querySelector("meta[name='twitter:image']");
 if(twitterImage){ twitterImage.content=settings.image || "" }

 //current custom CSS
 const currentCSS = document.querySelector("#customCSS");
 const saveCSSto = newDoc.querySelector("#customCSS");
 saveCSSto.innerHTML = currentCSS.innerHTML;

 //content - doc body
 newDoc.body.innerHTML = "<div class='container'>" + text + "</div><footer id='pageFooter'>" + settings.footer + "</footer>";

 //settings and source
 const data = {markdown: mdtext , settings: settings};
 const dataContainer = document.createElement("script");
 dataContainer.id="pageData";
 dataContainer.type = "data/json";
 dataContainer.innerHTML = JSON.stringify(data);
 newDoc.body.appendChild(dataContainer)
 //settings for JS
 const settingsContainer = document.createElement("script");
 settingsContainer.innerHTML = "window.settings=" + JSON.stringify(settings);
 newDoc.body.appendChild(settingsContainer);

 //and...
 const htm = newDoc.querySelector("html")
 return "<!DOCTYPE html>\n"+htm.outerHTML;
 
}

export function extractFromHTML(){
  const dataContainer = document.querySelector("script#pageData");
  if(!dataContainer){ 

    console.info("It is empty document");
     return {settings:{} , markdown: ""}
  }
  return JSON.parse(dataContainer.innerHTML);
}

export function saveFile(text, mdtext, settings, headHTML){
console.log("save with" , settings);
   const fn = settings.filename;
   const content = convert2html(text, mdtext, settings, headHTML);
   saveToDisk(fn, content);

}

function saveToDisk(name,content){
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', name);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

}
