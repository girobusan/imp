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
/**
 * Escape HTML unsafe chars 
 */
export function escapeTags(s){
  if(typeof s !== 'string'){ return s }
  const replacer=(tag)=>{return tagsToReplace[tag]||tag}
  return s.replace(/[&<>]/g , replacer);
}
/**
 * Unescape string (entities=> chars)
 */
export function unescapeTags(s){
  if(typeof s !== 'string'){ return s }
  const replacer=(tag)=>{return replaceToTags[tag]||tag}
  return s.replace(/&amp;|&lt;|&gt;/g , replacer);
}

