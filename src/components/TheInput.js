import { useRef, useCallback } from "preact/hooks";
import { If } from "./If";
import { html } from "htm/preact";
import { h } from "preact";

export default function TheInput(props) {
  const inp = useRef(null);
  const onChange = useCallback(() => {
    // props.area &&console.log("CHANGE" , inp.current.value) ) ;
    props.handler(inp.current.value);
  }, [props.handler, inp]);
  // props.area && console.log("input props" , props);

  return html`<div class="TheInput control is-expanded">
  <label class="label" for=${props.name || ""}>${props.title}</label>
  <${If} condition=${props.area == true}>
  <textarea ref=${inp} 
  tabindex=${props.tabindex || ""}
  style="min-height: 100px;transition:height .5s"
  class="input" 
  name=${props.name || ""} 
  onfocus=${(e) => {
      const bh = e.target.getBoundingClientRect().height;
      const sh = e.target.scrollHeight;
      if (sh > bh) {
        e.target.style.height = sh + 16 + "px";
      }
    }}
    onblur=${(e) => (e.target.style.height = "100px")}
    onkeyup=${(e) => {
      const bh = e.target.getBoundingClientRect().height;
      const sh = e.target.scrollHeight;
      if (sh > bh) {
        e.target.style.height = sh + 16 + "px";
      }
    }}
      value=${props.value || ""}
      onchange=${onChange}
      
      />
      </${If}>
      <${If} condition=${props.area == false}>
      <input class="input" type="text" ref=${inp} name=${props.name || ""}
      tabindex=${props.tabindex || ""}
      placeholder=${props.placeholder || ""}
      value=${props.value || ""}
      onchange=${onChange}
      ></input>
      </${If}>
      </div>`;
}
