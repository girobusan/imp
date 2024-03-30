import { escapeTags , unescapeTags } from "./fileops"
const version = VERSION;

/*
 <!--!block_name-->  /<!--!\s?(\w+)\s?-->(.+)<!--!!-->/
 <!--!!-->    /<!--!!-->/
 */
function HTMLTemplate(ht){
  return "<main class='container'>" + ht + "</main>"
}

export function renderHTMLFromObj({
   htmlText,
   mdText,
   footer,
   title,
   description,
   image,
   icon,
   customCSS,
   customHeadHTML,
   settings, //escaped
   editor,
   viewCSS,
   author,
   keywords
} , noScript){
   return renderHTML(htmlText, mdText, footer, title, description, image, icon, customCSS, customHeadHTML, settings, editor, viewCSS, author, keywords , noScript)
 
}

export function renderHTML(
   htmlText,
   mdText,
   footer,
   title,
   description,
   image,
   icon,
   customCSS,
   customHeadHTML,
   settings, //escaped
   editor,
   viewCSS,
   author,
   keywords,
   noScript

){
return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description || ""}">
  <meta name="author" content="${author || ""}">
  <meta name="keywords" content="${keywords || ""}">
  <meta name="og:title" content="${title}">
  <meta name="og:description" content="${description || ""}">
  <meta name="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${image}">
  <link rel="icon" type="image/png" href="${icon}">
  <link id = "viewCSS" rel="stylesheet" href="${viewCSS || "style.css"}">
  <style id="customCSS">${customCSS || ""}
  </style>
  <script>
   window.settings = ${JSON.stringify(settings , null , 2)}
   window.savedWithImpVersion = "${version}"
  </script>
  <script>
    window.addEventListener("DOMContentLoaded" , function(){
  ${  noScript===true ? "return;/*" : ""}
   function IMPEdit(){
   console.info("Loading editor...")
   const editor = document.createElement("script");
   editor.id="editorScript";
   editor.src="${editor || "imp.js"}";
   document.head.appendChild(editor);
   }

   if(window.self.name==="IMPPreviewIframe")
   {
   return;
   }
   if(window.location.search.indexOf("mode=view")!=-1)
   {
   return;
   }
   if(window.location.search.indexOf("mode=edit")!=-1)
   {
   IMPEdit();
   return;
   }
   if(window.location.search.indexOf("mode=download")!=-1){
   IMPEdit();
   return;
   }
   if(window.location.protocol==="file:"){
   IMPEdit();
   }
  ${  noScript===true ? "*/" : ""}
})
  </script>
  ${customHeadHTML||"<!--custom html here-->"}
</head>
<body>
${HTMLTemplate(htmlText)}
<footer id="pageFooter">${footer}</footer>
<script id="pageData" type="text/markdown">${escapeTags( mdText )}</script>
</body>
</html>`

}

