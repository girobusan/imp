import { escapeTags , unescapeTags } from "./fileops"

/*
 <!--!block_name-->  /<!--!\s?(\w+)\s?-->(.+)<!--!!-->/
 <!--!!-->    /<!--!!-->/
 */
function HTMLTemplate(ht){
  return "<div class='container'>" + ht + "</div>"
}

export function renderHTML(
   htmlText,
   mdText,
   footer,
   title,
   description,
   image,
   customCSS,
   customHeadHTML,
   settings, //escaped
   editor,
   viewCSS,
   author,
   keywords

){
return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="">
  <meta name="author" content="${author}">
  <meta name="keywords" content="${keywords}">
  <meta name="og:title" content="${title}">
  <meta name="og:description" content="${description}">
  <meta name="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${image}">
  <link rel="icon" type="image/png" href="">
  <link id = "viewCSS" rel="stylesheet" href="${viewCSS || "style.css"}">
  <style id="customCSS">${customCSS}
  </style>
  <script>
   window.settings = ${JSON.stringify(settings , null , 2)}
  </script>
  <script>
    window.addEventListener("DOMContentLoaded" , function(){

      function IMPEdit(){
      console.info("Loading editor...")
      const editor = document.createElement("script");
      editor.id="editorScript";
      editor.src="${editor || "imp.js"}";
      document.head.appendChild(editor);
      }

   if(window.self.name==="IMPPreviewIframe"){
   return;
   }
   if(window.location.hash==="#view"){
   return;
   }
   if(window.location.hash ==="#edit"){
   IMPEdit();
   }
   if(window.location.protocol==="file:"){
   IMPEdit();
   }
})

window.addEventListener("hashchange", ()=>history.go(0));
  </script>
  ${customHeadHTML||"<!--custom html here-->"}
</head>
<body>
${HTMLTemplate(htmlText)}
<footer id="pageFooter">${footer}</footer>
<script id="pageData" type="text/markdown">
${escapeTags( mdText )}
</script>
</body>
</html>`

}

