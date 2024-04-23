const emoji = require('markdown-it-emoji');
const hljs = require('highlight.js/lib/common');

export const md = require('markdown-it')({
  html:true,
  langPrefix: 'language-',
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // use external default escaping
  }

})
.use(emoji )
.use(require('markdown-it-checkbox'))
.use(require('markdown-it-small'))
.use(require('markdown-it-footnote'))
.use(require('markdown-it-multimd-table') , { 
  headerless: true,
  multiline: true
})

//BLACK MAGIC ZONE
//
const helperRx = /^```(?:helper|h):([a-z0-9-_]+)(\/[a-z0-9_-]+)?$([^]+?)^```$/igm ;

async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (full, ...args) => {
    promises.push(asyncFn(full, ...args));
    return full;
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

// g1 = helper name
// g2 = helper subtype, with slash (/json)
// g3 = helper settings

function findHelpers(mdtext , draft){
  let action = draft ? "preview" : "render";
  return replaceAsync( mdtext ,  helperRx , function(f , name , subname , params){
     return window.impHelpers.engage( name , action, params , subname) 
  })
}

export function renderMd(mdtext ){
  return md.render(mdtext);
}

export async function renderMdAsync(mdtext , draft){
  if(window.impHelpers)
  {
    return findHelpers(mdtext , draft)
    .then(r=>md.render(r))
  }else{
     return md.render(mdtext)
  }
  // return md.render(mdtext);
}

