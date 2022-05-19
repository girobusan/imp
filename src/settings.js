
const STORE = {};
const props = ["title" , "description" , "image" , "icon" , "filename" , "footer"]
var callback ;

export function create(jss , cb){
console.log("JSS" , jss)
  if(cb){callback=cb}
  Object.assign(STORE , jss);
  console.log("STORE" , STORE)
  return createWrapper();
}

function updated(k,v){
  if(callback){callback(k,v)}
  console.log("Updated setting" , k)
}

function createWrapper(){
   const w = {};
   w.listProps = ()=> props.slice(0);
   w.copy = ()=> Object.assign({} , STORE);
   props.forEach( p=>{
      w[p] = (v)=>{ if(v===undefined){return STORE[p]} ;  
      if(STORE[p]==v){return w}
      STORE[p]=v ; updated(p,v) ; return w }
   } )
   return w;
}

