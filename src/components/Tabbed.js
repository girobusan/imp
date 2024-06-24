import {h} from "preact";
import {html} from "htm/preact";
import { unescapeTags } from "../util";
require("./tabbed.scss");



function Tab({title , textTitle , key ,  action , active , customClass}){
    return html`
<button class="Tab ${active? 'active' : 'faded'} ${customClass ? customClass : ""  }" 
title=${textTitle || title}
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
    index=${e.index || i}
    key=${e.index || i} 
    title=${e.title} 
    textTitle=${e.textTitle || e.title}
    customClass=${ e.customClass || ""}
    active=${ selected===(e.index===undefined ? i : e.index)}
    action=${ ()=>e.action? e.action() : selectFn(e.index===undefined ? i : e.index)} />`})
  }
  </div>
  <div class="tabBranding" dangerouslySetInnerHTML=${{__html: branding}}></div>
</div>`
}

