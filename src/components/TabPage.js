import { h} from "preact";
import {html} from "htm/preact";

export default function TabPage({ title , index , selectedIndex, children}){
   
   return html`
   <div 
    class="TabPage ${ index===selectedIndex ? 'shown' : 'not_shown'}"
    style=${{ "display" : index===selectedIndex ? 'block' : 'none'}}
    >
      ${children}
  </div>
`
}

