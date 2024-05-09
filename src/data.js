import { h } from 'preact'
import { useState , useMemo} from 'preact/hooks';
import { html } from 'htm/preact'
require( "./scss/dataui.scss" )
/*
 *
 * Data module
 *
 */

function proxify(handler){
if(typeof window.impData === 'Proxy'){ console.error("Double proxification prevented"); return }
const DATA = window.impData || {}

const PROXY = {
  deleteProperty: function( t , n ){
    delete t[n];
    handler( Object.assign({} , t) )
    return true;
  },
  set: function( t, n , v , r){
    //escape string  
     t[n] = v ;
     handler( Object.assign({} , t) )
     return true;
  }
}
console.info( "Data proxified." )
window.impData = new Proxy( DATA , PROXY );
}
function uploadData(type){
  const e = document.createElement("input");
  e.type="file";
  e.onchange=()=>{
    const f = e.files[0];
      // console.log("file" , f)
      const n = f.name;
      f.text()
      .then(r=>{
      console.log(f.type);
        
        var c = r;
        var t = "string"
        if(type=='json'){
          try{
            c=JSON.parse(r);
            t = "object"
          }catch{
            console.log("Can not parse JSON")
            // c= csvParse(r);
          }
        }
        window.impData[n]={ type: t , data: c }
      })
  }

  document.body.appendChild(e);
  e.click();
  e.remove();
  
}

export function DataUI(props){
   
  const [data , setData] = useState(window.impData || {})
  useMemo( ()=>proxify(setData) , [] )
  console.log("Render" , data )

  return html`<div class="DataUI" > 
  <table><thead>
  <tr><th>id</th><th>type</th><th>del</th></tr>
  </thead>
  <tbody>
  ${ Object.keys( data )
  .map( k=>html`<tr>
  <td>${k}</td>
  <td>${data[k].type}</td>
  <td>${ html`<button onclick=${()=>{console.log("del") ; delete window.impData[k] ; console.log(window.impData) } }>del</button>` }</td>
  </tr>` ) }
  </tbody>
  </table>
  ${ Object.keys(data).length==0 && html`<div class="noData">no data</div>` }
  <div class="dataTools">
   <button onclick=${()=>uploadData("json")}>Embed JSON</button>
   <button onclick=${ uploadData }>Embed Text</button>
  </div>
  </div>`
}


