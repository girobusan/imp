import {h} from "preact";
import {html} from "htm/preact";
require("./tabbed.scss");
import burgerIcon from "../icons/menu_FILL0_wght400_GRAD0_opsz24.svg?raw";



function Tab({title , textTitle , key ,  action , active , customClass}){
  return html`
<button class="Tab ${active? 'active' : 'faded'} ${customClass ? customClass : ""  }" 
  title=${textTitle || title}
  onClick=${()=>typeof action === 'function' && action(key)}
  dangerouslySetInnerHTML=${{__html: title}}
> </button>`
}

function MenuItem({ label , action}){
  return html`<div class="MenuItem" dangerouslySetInnerHTML=${{__html: label}} 
    onClick=${ ()=>typeof action === 'function' && action()}
  >

  </div>`
}


export default function Tabbed({ selectFn , menuToggler , menuItems , menuVisible , selected,  tabs , branding="*" })
{ 
  return html`
<div class=${ "Tabbed " + "selectedTab_"+selected }>
<div class="tabHeader">
<button class="burgerMenu"
  onClick=${menuToggler}
  dangerouslySetInnerHTML=${{__html: burgerIcon}}
></button>
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
<div class="dropDownMenu" style=${{display: menuVisible ? "block" : "none"}}>
  ${ menuItems && menuItems.map( m=>html`<${MenuItem} label=${m.label}/>`)}
</div>
</div>
<div class="tabBranding" dangerouslySetInnerHTML=${{__html: branding}}></div>
</div>`
}

