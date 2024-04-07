import { escapeTags , unescapeTags } from "./fileops"
const yaml = require('js-yaml');

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
   "viewCSS",
   "author",
   "keywords"
   ]
var callback ; //called on update setting, maybe not required

export function create(settings_src , cb){
// console.log("Creating settings wrapper" , settings_src)
  // props.forEach( k=>STORE[k]="" );
  if(cb){callback=cb}
  props.forEach(p=>STORE[p]=settings_src[p] || "");
  return createWrapper();
}

export function cleanupObj( obj , safe){
  return props.reduce( (a,e)=>{ 
    if(safe && ['editor'].indexOf(e)!=-1){ return a }
    if( prepFalsy(obj[e]) ){
        a[e] = obj[e]
    }
    return a;
  } , {} )
}
export function addEmpties(obj){
   props.forEach( k=>{ if(!obj[k]){ obj[k]="" } } );
   return obj;
}

function updated(k,v){
  if(callback){callback(k,v)}
  // console.log("Updated setting" , k)
}

function escapedCopy(obj){
  const SRC = obj || STORE;
  return props.reduce( (a,e)=>{a[e]=( SRC[e] || "" ) ; return a}  , {})
  
}

function prepFalsy(something){
  if( typeof something === "string"){
      return something.trim();
  }
  return something;
}

function dump2YAML(obj){
   const cleanVersion = Object.keys(obj)
       .reduce( ( a,e )=>{ if( prepFalsy( obj[e] ) ){ a[e]=obj[e] } ; return a  } 
       , {} );

       return yaml.dump(cleanVersion);
}



function unescapedCopy(obj){
  const SRC = obj || STORE;
  return props.reduce( (a,e)=>{a[e]=unescapeTags( SRC[e] || "" ) ; return a}  , {})
}

function createWrapper(obj){
   const w = {};
   const SRC = obj || STORE;
   w.listProps = ()=> props.slice(0);
   w.copy = (escape)=> escape ? escapedCopy(SRC) : unescapedCopy(SRC);
   w.dump = ()=>dump2YAML( unescapedCopy(SRC) );
   props.forEach( p=>{
      w[p] = (v)=>{ if(v===undefined){return unescapeTags( SRC[p] || "" )} ;  
      const ev = escapeTags(v);
      if(SRC[p]===ev){return w}
      SRC[p]=ev ; updated(p,v) ; return w }
   } )
   return w;
}

