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
var callback ;

export function create(settings_src , cb){
// console.log("Creating settings wrapper" , settings_src)
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

function updated(k,v){
  if(callback){callback(k,v)}
  // console.log("Updated setting" , k)
}

function escapedCopy(){
  return props.reduce( (a,e)=>{a[e]=( STORE[e] || "" ) ; return a}  , {})
  
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



function unescapedCopy(){
  return props.reduce( (a,e)=>{a[e]=unescapeTags( STORE[e] || "" ) ; return a}  , {})
}

function createWrapper(){
   const w = {};
   w.listProps = ()=> props.slice(0);
   w.copy = (escape)=> escape ? escapedCopy() : unescapedCopy();
   w.dump = ()=>dump2YAML( unescapedCopy() );
   props.forEach( p=>{
      w[p] = (v)=>{ if(v===undefined){return unescapeTags( STORE[p] || "" )} ;  
      const ev = escapeTags(v);
      if(STORE[p]===ev){return w}
      STORE[p]=ev ; updated(p,v) ; return w }
   } )
   return w;
}

