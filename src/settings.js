import { escapeTags , unescapeTags } from "./fileops"

const STORE = {};
const props = [
   "title" , 
   "description" , 
   "image" , 
   "icon" , 
   "filename" , //html 
   "footer" ,  //html
   "css" , //html
   "headHTML", //html
   "editor",
   "viewCSS"
   ]
var callback ;

export function create(settings_src , cb){
// console.log("Creating settings wrapper" , settings_src)
  if(cb){callback=cb}
  Object.assign(STORE , settings_src);
  props.forEach(p=>STORE[p]=escapeTags(settings_src[p] || ""));
  return createWrapper();
}

function updated(k,v){
  if(callback){callback(k,v)}
  // console.log("Updated setting" , k)
}

function escapedCopy(){
  return props.reduce( (a,e)=>{a[e]=( STORE[e] || "" ) ; return a}  , {})
  
}

function unescapedCopy(){
  return props.reduce( (a,e)=>{a[e]=unescapeTags( STORE[e] || "" ) ; return a}  , {})
}

function createWrapper(){
   const w = {};
   w.listProps = ()=> props.slice(0);
   w.copy = (escape)=> escape ? escapedCopy() : unescapedCopy();
   props.forEach( p=>{
      w[p] = (v)=>{ if(v===undefined){return unescapeTags( STORE[p] || "" )} ;  
      const ev = escapeTags(v);
      if(STORE[p]===ev){return w}
      STORE[p]=ev ; updated(p,v) ; return w }
   } )
   return w;
}

