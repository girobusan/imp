const yaml = require('js-yaml');
import preloaderCode from './preloader.htm?raw';

var helpers = {};
var paramFormatters={};
var paramFormats={};
var callbacks = {};
var previewCache = {};

const escapeStr = (s)=>s.replace(/</g , "&lt;").replace(/>/g , "&gt;")
const unescapeStr = (s)=>s.replace(/&lt;/g , "<").replace(/&gt;/g , ">")

const jsonFmt = (p)=>{
  let r = p;
  // try{
    r=JSON.parse(p)
  // }catch(e){ console.error("Can not parse JSON" , p , e) }
  return r;
}
const yamlFmt = (p)=>{
  let r=p;
  // try{
    r=yaml.load(p)
  // }catch(e){ console.error("Can not parse YAML" , p ,e) }
  return r;
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

export function attachScript(url , id){
  const st = document.createElement("script");
  if( id ){ st.id=id };
  return new Promise( (res, rej)=>{
      document.head.appendChild(st);
      st.addEventListener("load", res);
      st.addEventListener("error",(e)=>{ console.error("Can not load script", e) ;st.remove() ; rej("Can not load script") });
      st.setAttribute("src", url)
  } )
}

function defaultPreview(name, text){ 
     return `<div style="background-color: silver; 
     padding:32px;text-align:center;color: #444;
     font-size:0.8em;border-radius: 6px;font-family:ui-monospace, monospace;">
    <strong>${name}</strong><p>${text || ""}</p> </div>`
  }

  function defaultRender( name , params , params_raw ){
    const paramFormatter = paramFormats[name];
    const safeParams = escapeStr(params_raw);

     let paramsScript = `<script type="text/plain">${safeParams}</script>`;

     if( paramFormatter==='json'){ paramsScript=`<script type="application/json">${safeParams}</script>` }
     if( paramFormatter==='yaml' ){ paramsScript=`<script type="application/yaml">${safeParams}</script>` } 
     
     return `<div data-ihelper="${ name }" data-defaultrender="true" 
     data-paramformat="${paramFormatter}">
       ${preloaderCode.replace("####" , name)}
       ${ paramsScript }
     </div>`
  }

function addHelper(name){
  // console.log("Add helper" , name ) 
  return timeout( 
  new Promise(
    (res, rej)=>{
      callbacks[name] = res;
      const url = "./helpers/" + name + ".js";
      attachScript(url)
      .catch(e=>{  rej(e) })
      ; 
    }
  ) , 500 , "dropped by timeout:"+name);
}

function getHelper(name){
  // console.log("getting helper" , name )
  return new Promise(
    (res , rej)=>{
       // console.log("test if already here" , helpers);
        if(helpers[name]){ res(helpers[name]) ; return }
        addHelper(name)
        .then( r=>{
         // console.log("About to finally get" , r) ;
         res(r) })
        .catch(e=>rej(e))
    }
  )
}


async function cachedPreview( name ,  params_raw , subname ){
  // console.log("trying to cached preview")
  let params="";
  const cacheTime = 2000;
  const cacheKey = name + "/" + subname;
  let myCache = tracePath( previewCache ,[ cacheKey , params_raw ] ) 
  const killCache = ()=>delete previewCache[cacheKey][params_raw];

  if( myCache["result"] ){
    // console.log("CACHED!" , name )
    //reset timer
    window.clearTimeout( myCache["timer"] )
    myCache["timer"] = window.setTimeout(killCache , cacheTime)
    //cached result
    return myCache["result"]
  }

  return getHelper(name)
  .then(hlp=>{ 
    myCache["timer"] = window.setTimeout( killCache , cacheTime);
    // myCache["result"] = ( "preview" in hlp ) ? 
    // hlp["preview"](paramFormats[name](params_raw), params_raw , subname) 
    // : defaultPreview("Preview: " + name , params_raw || "See you in view mode!");
    if("preview" in hlp){
      try{
        myCache["result"] = hlp["preview"](paramFormatters[name](params_raw), params_raw , subname) 
      }catch{
        myCache["result"] = defaultPreview("Preview: " + name ,  "Can not render preview (incomplete params?)")
      } 
    }else{
      myCache["result"] = defaultPreview("Preview: " + name , params_raw || "See it in view mode")
    }
    return myCache["result"]
  })
  .catch(e=>console.error("Can not preview", name , e))
  }

  function makeFormatter( hname , pfname ){
    paramFormats[hname] = pfname;
    switch(pfname.toLowerCase()) {
       case "json": paramFormatters[hname]= jsonFmt;
       break;
       case "yaml": paramFormatters[hname]= yamlFmt;
       break;
       default: paramFormatters[hname]= (p)=>p; paramFormats[hname] = "raw";
       break;
    }
    
  }

window.impHelpers = {

  register: async (name , helper , paramFmt)=>{ 
    console.info("register" , name)
    helpers[name]=helper  ; 
    makeFormatter(name, paramFmt);
    "init" in helpers[name] && await helpers[name].init();
    if(typeof callbacks[name] === 'function'){ 
      callbacks[name](helpers[name]);
      callbacks[name]=null;
    }else{
      console.info("Invalid callbacks chain for" , name)
    }
  },

  engage: async function( name ,  action ,  params_raw ,  subname ){
    // console.log("action" , action)
    if(action=="preview"){ 
      return cachedPreview( name ,  params_raw , subname ) 
    }
    //render
    return await getHelper(name)
    .then(hlp=>{ 
      if(action in hlp){
        return hlp[action](paramFormatters[name](params_raw), params_raw , subname) 
      }
      return defaultRender(name, paramFormatters[name](params_raw), params_raw)
    }
    )
  .catch((e)=>console.error("Can not engage" , name , e))
  },
  
  animateHelper: async ( name , element , params , params_raw )=>{
     return getHelper(name)
     .then(hlp=>{ "animate" in hlp && hlp["animate"](element , params , params_raw ) })
     .catch((e)=>console.info("Can not animate" , e))
  },

  //service

  attachScript: attachScript,
  parseYAML: yamlFmt,
  defaultPreview: defaultPreview,
  defaultRender: defaultRender,
  disable: ()=>window.impHelpers = null,

}
//do view mode work

var viewModeDone = false;

function viewModeWork(){
   //figure out view mode
   const editor = document.head.querySelector("#editorScript");
   const viewModeMark = window.location.search.indexOf("mode=view")!=-1 ;
   const editModeMark = window.location.search.indexOf("mode=edit")!=-1 ;
   const protoIsFile = window.location.protocol.startsWith("file");

   if( (editor || editModeMark) ||
   (protoIsFile && !viewModeMark) ||
   viewModeDone
   ){ 
     return 
   }
   
   // console.log("view mode work!" )
   const myGuys = document.querySelectorAll("*[data-ihelper]");
   myGuys.forEach(e=>{
      const name = e.dataset.ihelper;
      let p_raw = null;
      let p_parsed = null;
      if(e.dataset.defaultrender){ 
          
          const ps = e.querySelector( "script" )
          if(ps){
               p_raw = unescapeStr( ps.textContent );
               p_parsed = paramFormatters[name](p_raw);
          }
      }
      window.impHelpers.animateHelper( name,  e , p_parsed , p_raw );
      //.then(r=>console.log("engaged" , r))
   })
   viewModeDone = true;
}

if(document.readyState=='complete'){
   viewModeWork();
}else{
   window.addEventListener("DOMContentLoaded", viewModeWork)
}
