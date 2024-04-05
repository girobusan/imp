import { useRef } from "preact/hooks";
import { If } from "./If";
import {html} from "htm/preact";
import { h } from "preact";

export default function TheInput(props){
  const inp = useRef(null);
  const onChange = ()=>{props.handler(inp.current.value)};

  return html`<div class="TheInput">
  <label class="label" for=${props.name || "" }>${props.title}</label>
  <${If} condition=${props.area==true}>
  <textarea ref=${inp} 
  style="min-height: 100px;transition:height .5s"
  class=${"input biginout area"+props.name}
  name=${props.name || ""} 
  onfocus=${(e)=>{
    const bh = e.target.getBoundingClientRect().height;
    const sh = e.target.scrollHeight;
    if(sh>bh){
      e.target.style.height=(sh+16)+"px"
    }
    }}
    onblur=${ (e)=>e.target.style.height="100px" }
    onkeyup=${(e)=>{ 
      const bh = e.target.getBoundingClientRect().height;
      const sh = e.target.scrollHeight;
      if(sh>bh){
        e.target.style.height=(sh+16)+"px"
      }
      onChange()
      }}
      onchange=${(e)=>{ onChange(); }} >
      ${props.value || ""}
      </textarea>
      </${If}>
      <${If} condition=${props.area==false}>
      <input class="input" type="text" ref=${inp} name=${props.name || ""}
      value=${props.value || ""}
      onchange=${onChange}
      ></input>
      </${If}>
      </div>`

      }

