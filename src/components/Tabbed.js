import {h} from "preact";
import {html} from "htm/preact";
require("./tabbed.scss");



function Tab({title , key ,  action , active , customClass}){
    return html`
<button class="Tab ${active? 'active' : 'faded'} ${customClass ? customClass : ""  }" 
onClick=${()=>typeof action === 'function' && action(key)}
  dangerouslySetInnerHTML=${{__html: title}}
> </button>`
}


export default function Tabbed({ selectFn , selected,  tabs , branding="*" })
{ 
  return html`
  <div class=${ "Tabbed " + "selectedTab_"+selected }>
  <div class="tabHeader">
  ${ tabs.map( (e,i)=>{
    return html`<${Tab} 
    index=${i}
    key=${i} 
    title=${e.title} 
    customClass=${ e.customClass || ""}
    active=${ selected===i}
    action=${ ()=>e.action? e.action() : selectFn(i)} />`})
  }
  </div>
  <div class="tabBranding" dangerouslySetInnerHTML=${{__html: branding}}></div>
</div>`
}

