if(!fetch.isAlreadyFixed){

  function tryParse(d){
    let r = d ;
    try{
       r=JSON.parse(d)
    }catch{ console.error("can not json") ; return {} }
    return r; 
  }

 const real_fetch = fetch;
 window.fetch = function( url , opts ){
   if(url.startsWith("@")){
      const dataId = url.substring(1);
      if(!window.impData[dataId]){ return Promise.reject("No such data") }
      const dataType = window.impData[dataId].type;
      const d = window.impData[dataId].data
      return Promise.resolve( {
        ok: true,
        status: 200,
        blob: ()=>Promise.resolve( new Blob( [ dataType=='object' ? JSON.stringify(d) : d ] ) , {type: "text/plain"} ),
        text: ()=> Promise.resolve( dataType=='object' ? JSON.stringify(d) : d) ,
        json: ()=> Promise.resolve( dataType=='object' ? d : tryParse(d))
      } )
   }
   return real_fetch(url,opts);
 }
 window.fetch.isAlreadyFixed = true;
}
