const yaml = require('js-yaml');
import preloaderCode from './preloader.htm?raw';
const oldFetch = fetch;

window.fetch = function(url , para){
   return oldFetch(url , para);
}

var viewMode = false;
var viewModeDone = false;


var helpers = {
   //system helpers
   "save-data": {
     render: (params  , params_raw , subname)=>{
       prepData(params_raw , subname); return "" }
   },

   "save-json": {
     render: (params  , params_raw , subname)=>{
       prepData(params , subname) ; return "" }
   }
}

var paramFormatters={
  "save-data" : (d)=>d,
  "save-json" : parseJSON
};

var paramFormats={};
var previewCache = {};
var postprocessors = [];
var savedData={};
var dataCallbacks=[];

var callbacks = {};
var rejects = {};


function packParams(p , fold){
  let r = encodeURI(p) ;
  if(fold){ return r.match( /.{1,64}/g ).join("\n") };
  return r;
}

function unpackParams(p){
  return decodeURI(p.replace( /\n/g , "" ))
}

function parseJSON(p){
if(!p || !p.trim()){ return {} }
    return JSON.parse(p)
}
function parseYAML(p){
if(!p || !p.trim()){ return {} }
    return yaml.load(p)
}

function tracePath(obj , keys){
  let cursor = obj;
  keys.forEach( k=>{  
    if(!cursor[k]){ cursor[k] = {} } 
    cursor = cursor[k];
    return;
  })
  return cursor;
}

function timeout(prom, time, exception) {
  let timer;
  return Promise.race([
    prom,
    new Promise((_r, rej) => timer = setTimeout(rej, time, exception))
  ]).finally(() => clearTimeout(timer));
}

// DATA ATTACHMENTS
//
// Gather data for future saving
function prepData( d , id ){
   const dtype = typeof d === 'string' ? "string" : "object" ;
   savedData[id] = { type: dtype, data: d }
}

// Attach gathered data to html
function attachData(html){
  let r = html + "\n<script>window.datasets={};\n"
  Object.keys(savedData).forEach( k=>{
     const strdata = JSON.stringify(savedData[k])
     const strscript = `window.datasets["${k}"]=${strdata};
     `
     r+=strscript;
  } )
  r+="\nwindow.impHelpers.dataDone(window.datasets)\n"
  return r+="</script>"
}

// Retrieve attached data in View Mode
// Async
function getData(id){
  //get data from window
  return new Promise( (res , rej)=>{ 
    if(!viewMode){ rej("Can not retrieve data in this mode!") }
     dataCallbacks.push( (d)=>{ return d[id] ? res(d[id]) : rej("No such data: " + id) } );

  } )
}

function attachScript(url , id){
  const st = document.createElement("script");
  if( id ){ st.id=id };
  return new Promise( (res, rej)=>{
    document.head.appendChild(st);
    st.addEventListener("load", res);
    st.addEventListener("error",(e)=>{ console.error("Can not load script", e) ;st.remove() ; rej("Can not load script file.") });
    st.setAttribute("src", url)
  } )
}

function error(title , details){
  return `<div style="background-color:orangered;border-radius:6px;
  color:black;padding:32px;font-family:ui-monospace,monospace;font-size:0.8em">
  ${title.trim()}: ${details &&  details.toString().trim()}</div>`
}

function defaultPreview(name, text){ 
  return `<div style="background-color: silver; 
  padding:32px;padding-top:18px;text-align:left;color: #666;
  font-size:0.8em;border-radius: 6px;font-family:ui-monospace, monospace;">
  <strong>${name}</strong><pre style="margin:0">${text && text.replace(/^\s*\n/g , "") || ""}</pre></div>`
}

function defaultRender( name , params , params_raw , subname){
  // const paramFormatter = paramFormats[name];
  const safeParams = ( params_raw && params_raw.trim() ) ? encodeURI(params_raw) : "";
  return `<div data-ihelper="${ name }" 
  data-defaultrender="true" 
  data-params="${safeParams}"
  data-subname="${subname}">${preloaderCode.replace("####" , name)}</div>`
}

function addHelper(name){
  if(callbacks[name]){
     //we're already waiting for this helper
     return new Promise( (res, rej)=>{
        callbacks[name].push(res);
        if(!rejects[name]){ rejects[name] = [] }
        rejects[name].push(rej);
     } )
     
  }
  // we're loading it first time
  return timeout( 
    new Promise(
      (res, rej)=>{
        callbacks[name] = [];
        callbacks[name].push(  res );
        const url = "./helpers/" + name + ".js";
        attachScript(url)
      .catch(e=>{  
          //reject all
          if(rejects[name]){
             rejects[name].forEach(r=>r(e));
             delete rejects[name];
          }
          rej(e) })
        ; 
      }
    ) , 2000 , "Dropped by timeout:"+name);
}

async function getHelper(name){
  // console.log("getting helper" , name )
  return new Promise( 
    (res , rej)=>{
      if(helpers[name]){ res(helpers[name]) ; return }
      addHelper(name)
      .then( r=>{
        res(r) })
      .catch(e=>rej(e))
    }
  )
}


async function cachedPreview( name ,  params_raw , subname ){
  // console.log("trying to cached preview")
  const cacheTime = 2000;
  const fullName = name + ( subname ?  "/" + subname : "" );
  
  let myCache = tracePath( previewCache ,[ fullName , params_raw ] ) 
  const killCache = ()=>delete previewCache[fullName][params_raw];

  if( myCache["result"] ){
    //reset timer
    window.clearTimeout( myCache["timer"] )
    myCache["timer"] = window.setTimeout(killCache , cacheTime)
    //cached result
    return myCache["result"]
  }

  return getHelper(name)
  .then(hlp=>{ 
    myCache["timer"] = window.setTimeout( killCache , cacheTime);
    if("preview" in hlp){
      try{
        myCache["result"] = hlp["preview"](paramFormatters[name](params_raw), params_raw , subname) 
      }catch{
        myCache["result"] = defaultPreview("Preview: " + name ,  "Can not render preview (incomplete params?)")
      } 
    }else{
      //just for the test
      //we have to crash here if params are invalid
      params_raw.trim() && paramFormatters[name](params_raw.trim());
      myCache["result"] = defaultPreview("Preview: " + name , params_raw || "See it in view mode")
    }
    return myCache["result"]
  })
  .catch(e=>{ console.error("Can not preview", name , e) ; return error( name , e) })
}

function makeFormatter( hname , pfname ){
  paramFormats[hname] = pfname;
  switch(pfname.toLowerCase()) {
    case "json": paramFormatters[hname]= parseJSON;
      break;
    case "yaml": paramFormatters[hname]= parseYAML;
      break;
    default: paramFormatters[hname]= (p)=>p; paramFormats[hname] = "raw";
      break;
  }
}

function postprocess(  html , markdown){
  console.info("Postprocessing requested...")
  let r = html;
  if( postprocessors.length>0){
     console.info("Found postprocessors:" , postprocessors.length)
     postprocessors.forEach( p=>r=p(html,markdown) )
  }
  console.info("Postprocessing done.")
  if(Object.keys(savedData).length>0){ r = attachData(r) }
  return r;
}

const API = {

  register: async (name , helper , paramFmt , postprocessor)=>{ 
    if(name in helpers){ console.error("Attempt to re-register rejected:" , name) ; return }
    console.info("Registering:" , name)
    helpers[name]=helper  ; 
    makeFormatter(name, paramFmt);
    "init" in helpers[name] && await helpers[name].init( API , viewMode );
    if(callbacks[name]){ 
      // callbacks[name](helpers[name]);
      callbacks[name].forEach(c=>typeof c === 'function' && c(helpers[name]) )
      delete callbacks[name];
    }else{
      console.info("Invalid callbacks chain for" , name)
    }
    if(postprocessor){ 
       console.info("Postrocessor added from" , name)
          postprocessors.push( postprocessor ) 
      }
  },

  engage: async function( name ,  action ,  params_raw ,  subname ){

    if(action==="preview"){ 
      return cachedPreview( name ,  params_raw , subname ) 
    }
    //render
    return await getHelper(name)
    .then(hlp=>{ 
      if(action in hlp){
        return hlp[action](paramFormatters[name](params_raw), params_raw , subname) 
      }
      return defaultRender(name, paramFormatters[name](params_raw), params_raw , subname)
    }
    )
  .catch((e)=>{ console.error("Can not engage" , name , e) ; return error(name , e) })
  },

  animateHelper: async ( name , element ,  params_raw , subname)=>{
    // console.log("PRMS" , params_raw)
    return getHelper(name)
    .then(hlp=>{ "animate" in hlp && hlp["animate"](element , 
      params_raw ? paramFormatters[name](params_raw) : null , 
    params_raw , subname ) }
    )
  .catch((e)=>console.info("Can not animate " + name + ":" , e))
  },

  //postprocessing

  postprocess: postprocess,
  getData : getData,
  dataDone: (d)=>dataCallbacks.forEach( c=>c(d) ),
  //service

  packParams: packParams,
  unpackParams:unpackParams,
  attachScript: attachScript,
  parseYAML: parseYAML,
  //
  //default views
  defaultPreview: defaultPreview,
  defaultRender: defaultRender,
  errorNotice: error,

  disable: ()=>window.impHelpers = null, //:FIX:

} //end helper code

if(!window.impHelpers){
  console.info("Starting impHelpers module...");
  window.impHelpers = API;
}

function viewModeWork(){
  
  //figure out view mode
  const editor       = document.head.querySelector("#editorScript");
  const viewModeMark = window.location.search.indexOf("mode=view")!=-1 ;
  const editModeMark = window.location.search.indexOf("mode=edit")!=-1 ;
  const protoIsFile  = window.location.protocol.startsWith("file");

  if( (editor || editModeMark) ||
  (protoIsFile && !viewModeMark) ||
  viewModeDone
  ){ 
    return 
  }

  if(window.settings.disableInteractivity){
    console.info("Interactivity disabled by author.");
    return;
  }

  // console.log("view mode work!" )
  viewMode = true;

  const myGuys = document.querySelectorAll("*[data-ihelper]");
  myGuys.forEach(e=>{
    const name = e.dataset.ihelper;
    let p_raw = null;
    if(e.dataset.defaultrender){ 
      var subname = e.dataset.subname || "";
      const ps = e.dataset.params;
      if(ps){
        p_raw = decodeURI( ps );
      }
    }
    window.impHelpers.animateHelper( name,  e ,  p_raw , subname);
  })
  viewModeDone = true;
}

if(document.readyState=='complete'){
  viewModeWork();
}else{
  window.addEventListener("DOMContentLoaded", viewModeWork)
}
