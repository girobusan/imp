const yaml = require('js-yaml');

var helpers = {};
var paramFormats={};
var callbacks = {};
var previewCache = {};

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

function attachScript(url){
  const st = document.createElement("script");
  return new Promise( (res, rej)=>{
      document.head.appendChild(st);
      st.addEventListener("load", res);
      st.addEventListener("error",()=>{ console.log("oops") ;st.remove() ; rej("Can not load script") });
      st.setAttribute("src", url)
  } )
}

function defaultPreview(name, text){ 
     return `<div style="background-color: silver; 
     padding:32px;text-align:center;color: #444;
     font-size:0.8em;border-radius: 6px;font-family:ui-monospace, monospace;">
    <strong>${name}</strong><p>${text || ""}</p> </div>`
  }

function addHelper(name){
  console.log("Add helper" , name ) 
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
  console.log("getting helper" , name )
  return new Promise(
    (res , rej)=>{
       // console.log("test if already here" , helpers);
        if(helpers[name]){ res(helpers[name]) ; return }
        addHelper(name)
        .then( r=>{console.log("About to finally get" , r) ;  res(r) })
        .catch(e=>rej(e))
    }
  )
}


async function cachedPreview( name ,  params_raw , subname ){
  // console.log("trying to cached preview")
  let params="";
  const cacheTime = 1000;
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
    myCache["timer"] = window.setTimeout( killCache , cacheTime)
    myCache["result"] = ( "preview" in hlp ) ? 
    hlp["preview"](paramFormats[name](params_raw), params_raw , subname) 
    : defaultPreview("Preview: " + name , params_raw || "See you in view mode!");

    return myCache["result"]
  })
  .catch(e=>console.error("Can not preview", name , e))
  }

  function makeFormatter( hname , pfname ){
    const jsonFmt = (p)=>{
      let r = p;
      try{
          r=JSON.parse(p)
      }catch{ console.error("can not parse JSON" , p) }
      return r;
    }
    const yamlFmt = (p)=>{
       let r=p;
       try{
          r=yaml.load(p)
       }catch{ console.error("can not parse YAML" , p) }
       return r;
    }

    switch(pfname.toLowerCase()) {
       case "json": paramFormats[hname]= jsonFmt;
       break;
       case "yaml": paramFormats[hname]= yamlFmt;
       break;
       case "raw": paramFormats[hname]= (p)=>p;
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
    if(action=="animate"){
     return getHelper(name)
     .then(hlp=>{ "animate" in hlp && hlp["animate"]( params_raw ) })
     .catch((e)=>console.info("Can not animate" , e))
    }
    //render
     return await getHelper(name)
     .then(hlp=>hlp[action](paramFormats[name](params_raw), params_raw , subname))
     .catch((e)=>console.error("Can not engage" , name , e))
  },

  //service

  attachScript: attachScript

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
      window.impHelpers.engage( name , "animate" , e  )
      //.then(r=>console.log("engaged" , r))
   })
   viewModeDone = true;
}

if(document.readyState=='complete'){
   viewModeWork();
}else{
   window.addEventListener("DOMContentLoaded", viewModeWork)
}
