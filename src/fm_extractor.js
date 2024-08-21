export function extractFM(mdsrc) {
 const startRX = /^-{3,5}\s*\n/;
 const test = mdsrc.match(startRX);
 //
 //it definitely does not have frontmatter
 if (!test) {
  return { meta: "", markdown: mdsrc };
 }

 const divLength = Array.from(test[0].trim()).length;
 const endRX = new RegExp(`^-{${divLength}}\s*$`, ""); //*/*

 const strings = mdsrc.split("\n");

 let buffer = "";
 for (let i = 1; i < strings.length; i++) {
  //if we're in fm block, add string to buffer
  //if we're at it's end, return result
  if (strings[i].match(endRX)) {
   return { meta: buffer, markdown: strings.slice(i + 1).join("\n") };
  }
  buffer += strings[i];
  buffer += "\n";
 }
 //if we're here => something is wrong
 return { meta: false, markdown: mdsrc };
}

// module.exports = {extractFM: extractFM}
