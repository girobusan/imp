import { escapeTags, unescapeTags } from "./util";
import { stringifyData } from "./data";
import { stringifySettings } from "./settings";
const version = VERSION;

export function bodyTemplate(bodyHTML, footerHTML) {
  return `<main class="container" id="pageMain">${bodyHTML}</main>
${footerHTML ? "<footer id='pageFooter'>" + footerHTML + "</footer>" : ""}
`;
}

/** renderHTML
 * @param {string} mdText - markdown
 * @param {string} htmlText - html
 * @param {object} settings
 * @param {?Boolean} noScript - disable IMP! script
 */
export function renderHTML(htmlText, mdText, settings, noScript) {
  // if(noScript){ enableHelpers=false }
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${settings.title || ""}</title>
  <meta name="description" content="${settings.description || ""}">
  <meta name="author" content="${settings.author || ""}">
  <meta name="keywords" content="${settings.keywords || ""}">
  <meta name="og:title" content="${settings.title}">
  <meta name="og:description" content="${settings.description || ""}">
  <meta name="og:image" content="${settings.image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${settings.image}">
  <link rel="icon" type="image/png" href="${settings.icon}">
  <script>
   window.settings = ${stringifySettings(settings)};
   window.savedWithImpVersion = "${version}"
  </script>
${noScript ? "<!--" : ""}
  <script defer>
      (
        function () {
          function IMPEdit() {
            console.info("Loading editor...")
            const editor = document.createElement("script");
            editor.setAttribute("defer", "defer");
            editor.id = "editorScript";
            editor.src = "imp.js";
            document.head.appendChild(editor);
          }
          if (window.location.search.indexOf("mode=edit") != -1) {
            console.log("no edit");
            IMPEdit();
            return;
          }
          if (window.location.search.indexOf("mode=download") != -1) {
            IMPEdit();
            return;
          }
          if (window.location.protocol === "file:" &&
            window.location.search.indexOf("mode=view") == -1) {
            console.log("file edit")
            IMPEdit();
          }
        }
      )();
  
</script>
${noScript ? "-->" : ""}
  ${!noScript && settings.enableHelpers ? "<script defer src='helpers.js' id='helpersScript'></script>" : ""}
  <link id = "viewCSS" rel="stylesheet" href="${settings.viewCSS || "style.css"}">
  <style id="customCSS">${settings.customCSS || ""}</style>
  ${settings.customHeadHTML || "<!--custom html here-->"}
</head>
<body>
${bodyTemplate(htmlText, settings.footer)}
${`<script>window.impData=${stringifyData()}</script>`}
<script id="pageData" type="text/markdown">${escapeTags(mdText)}</script>
</body>
</html>`;
}
