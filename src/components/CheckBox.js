import { useRef ,  useState } from "preact/hooks";
import {html} from "htm/preact";
import { h } from "preact";

export default function CheckBox(props){
  const [state , setState] = useState(props.checked)
  const myInput = useRef(null);
  return html`<div class="control">
  <label class="checkbox">
  <input type='checkbox' 
  ref=${myInput}
  checked=${state}
  onclick=${ ()=>{ setState(myInput.current.checked) ; 
    typeof props.onChange==='function' && props.onChange(myInput.current.checked)
    }  }
    />
  <span dangerouslySetInnerHTML=${{__html: "&nbsp;"}}></span>
  ${ props.title || "Checkbox" } 
    </label>

  </div>`
}

