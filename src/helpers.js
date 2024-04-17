var helpers = {};
var paramFormats={};
var callbacks = {};

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
      st.addEventListener("error", rej);
      st.setAttribute("src", url)
  } )
}

function addHelper(h){
  return timeout( 
  new Promise(
    (res, rej)=>{
      callbacks[h] = res;
      const url = "./helpers/" + h + ".js";
      attachScript(url)
      .catch(e=>rej(e))
      ; 
    }
  ) , 500 , "dropped by timeout:"+h);
}

function getHelper(h){
  return new Promise(
    (res , rej)=>{
       // console.log("test if already here" , helpers);
        if(helpers[h]){ res(helpers[h]) ; return }
        addHelper(h)
        .then( r=>res(r))
        .catch(e=>rej(e))
    }
  )
}


window.impHelpers = {
  register: (n , f , pf)=>{ 
  helpers[n]=f  ; 
  paramFormats[n]=pf;
  if(typeof callbacks[n] === 'function'){ 
      callbacks[n](helpers[n]);
      callbacks[n]=null;
      }
  },

  engage: async function( helperName ,  action , params , subname ){
     return await getHelper(helperName)
     .then(hlp=>hlp[action](params, subname))
  }
}

