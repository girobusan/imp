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
.use(require('markdown-it-multimd-table') , { 
  headerless: true,
  multiline: true
})
