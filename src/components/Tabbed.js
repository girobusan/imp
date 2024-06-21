import {h} from "preact";
import {html} from "htm/preact";
require("./tabbed.scss");



function Tab({title , key ,  action , active , activeBg , activeFg}){
    return html`
<button class="Tab ${active? 'active' : 'faded'}" 
onClick=${()=>typeof action === 'function' && action(key)}>
${title}
</button>`
}


export default function Tabbed({ selectFn , selected,  tabs , branding="*" })
{ 
  return html`
  <div class="Tabbed">
  <div class="tabHeader">
  ${ tabs.map( (e,i)=>{
    return html`<${Tab} 
    index=${i}
    key=${i} 
    title=${e} 
    active=${ selected===i}
    action=${ ()=>selectFn(i)} />`})
  }
  </div>
  <div class="tabBranding" dangerouslySetInnerHTML=${{__html: branding}}></div>
</div>`
}

