import { escapeTags , unescapeTags } from "./util"
const yaml = require('js-yaml');

const STORE = {};
var SETTINGS;

const defaults ={

   "title" : "", 
   "description" : "", 
   "image" : "", 
   "icon" : "", 
   "filename" : "", //html 
   "footer" : "<small>Powered by IMP!</small>",  //html
   "css" : "", //html
   "headHTML": "", //html
   "editor": "",
   "viewCSS": "",
   "author": "",
   "keywords": "",
   "enableHelpers": false,
   "disableInteractivity": false,
   "pathToHelpersModule" : ""
}

const props = Object.keys(defaults)
var callback ; //called on update setting, maybe not required


//NEW SETTINGS ROUTINES
export function getSettings(){
  return SETTINGS
}
export function updateSettings( newSettingsObj){
   SETTINGS = Object.assign( SETTINGS , newSettingsObj)
  //+remove 
   return SETTINGS;
}

export function makeSettings(obj){
  //clean up
  Object.keys(obj).forEach(k=>{ if(props.indexOf(k)===-1){ delete obj[k]} })
  //unescape
  Object.keys(obj).forEach( k=>{
      ( typeof obj[k]==='string' ) && ( obj[k]=unescapeTags(obj[k]) )
  })
  SETTINGS = obj;
  return obj;
}
/*
/* stringify settings to JSON or YAML
 */
export function stringifySettings( obj , toYAML){
   let tobj = Object.assign({} , obj || SETTINGS);
   Object.keys(tobj).forEach( k=>{
      ( typeof tobj[k]==='string' ) && ( tobj[k]=escapeTags(tobj[k]) )
  })
  tobj=cleanupObj(tobj);
  return toYAML ? yaml.dump(tobj) : JSON.stringify();
}

//full cleanup: all empty key/value pairs are removed
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

// END NEW SETTINGS ROUTINES

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

