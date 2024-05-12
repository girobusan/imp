import { h } from 'preact'
import { useState , useMemo} from 'preact/hooks';
import { html } from 'htm/preact'
require( "./scss/dataui.scss" )
import { escapeTags } from './util';
const isProxy = Symbol("isProxy")
/*
 *
 * Data module
 *
 */
function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}

function sizeFormat(n){
  if(n<600){return n+"B"}
  return ( Math.round(n/102.4)/10 ) + "Kb";
}

function dataSize(d){
  return sizeFormat( byteCount( JSON.stringify(d) ) )
}

function proxify(handler){
if(window.impData[ isProxy ]){ console.info("Double proxification prevented") ; return }
const DATA = window.impData || {}

const PROXY = {
  deleteProperty: function( t , n ){
    delete t[n];
    handler( Object.assign({} , t) )
    return true;
  },
  set: function( t, n , v ){
    //escape string  
     t[n] = v;
     handler( Object.assign({} , t) )
     return true;
  },
  get: function(t,n){
    if(n===isProxy){ return true }
    if(!t[n]){ return null }
    let r = t[n]
    return r
  }
}
// console.info( "Data proxified." )
window.impData = new Proxy( DATA , PROXY );
}

export function stringifyData(){
  if(!window.impData){ return "{}" }
   return escapeTags( JSON.stringify(window.impData) );
}

function renameGUI(old){
 const newname = prompt("Enter new name" , old) || old;
  if(newname==old){ return }
  window.impData[newname] = window.impData[old];
  delete window.impData[old]
}

function downloadData(name){
   let content = window.impData[name].data; // = JSON.stringify(window.impData[name].data)
   if(window.impData[name].type === 'object'){ content = JSON.stringify(content , null , 2) }
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', name);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
   
}



function uploadData(type , name){
  const e = document.createElement("input");
  e.type="file";
  e.onchange=()=>{
    const f = e.files[0];
      // console.log("file" , f)
      const n = name || f.name;
      f.text()
      .then(r=>{
      // console.log(f.type);
        
        var c = r;
        var t = "string"
        if(type=='object'){
          try{
            c=JSON.parse(r);
            t = "object"
          }catch{
            console.log("Can not parse JSON")
          }
        }
        window.impData[n]={ type: t , data: c }
      })
  }

  document.body.appendChild(e);
  e.click();
  e.remove();
  
}

function DataRow(props){
let k = props.name
 return html`<tr>
  <td>${k}</td>
  <td>${window.impData[k].type}</td>
  <td>${ dataSize(window.impData[k].data) }</td>
  <td class="actionsTD">
  <button onclick=${ ()=>renameGUI(k) }>rename</button>
  <button onclick=${ ()=>uploadData(window.impData[k].type, k) }>replace</button>
  <button onclick=${ ()=>downloadData(k) }>download</button>
  <button onclick=${()=>delete window.impData[k] }>delete</button>
  </td>
 </tr>`
}

export function DataUI(props){
   
  const [data , setData] = useState(window.impData || {})
  useMemo( ()=>proxify(
  (d)=>{ typeof props.signal==='function' && props.signal(); setData(d)}) , 
  [] )

  return html`<div class="DataUI" > 
  <table><thead>
  <tr><th>id</th><th>type</th> <th>≈ size</th><th>actions</th></tr>
  </thead>
  <tbody>
  ${ Object.keys( data )
  .map( k=>html`<${DataRow} name=${k} />` ) }
  </tbody>
  </table>
  ${ Object.keys(data).length==0 && html`<div class="noData">no data</div>` }
  <div class="dataTools">
   <button onclick=${()=>uploadData("object")}>Embed JSON</button>
   <button onclick=${ uploadData }>Embed Text</button>
  </div>
  </div>`
}


