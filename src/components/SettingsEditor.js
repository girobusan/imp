import {h} from "preact";
import { DataUI } from "../data";
import TheInput from "./TheInput";
import CheckBox from "./CheckBox";

/*
 *
 * SettingsEditor
 *
 * 
 *
 */
export default function SettingsEditor(
  {
    //actions to take
    makeHandler,
    modified,
    setModified,
    saveHTML,
    duplicateFile,
    // settings to edit
    filename,
    title,
    author,
    keywords,
    description,
    image,
    icon,
    footer, //!
    customCSS, //!
    headHTML,
    enableHelpers,
    disableInteractivity,
    viewCSS,
    editor

  }
){
  console.log("title" , title)
  return html`
<div class="SettingsEditor main_ui ${modified ? 'modified' : 'still'}">

<h2 class="subtitle is-3">
Page settings 
</h2>
<!--form-->
<div class="formRow">
<${TheInput} 
title=${"File name"}
name=${"filename"}
value=${filename}
area=${false}
handler=${makeHandler("filename")}
/>
<div class="divider" />
<${TheInput} 
title=${"Title"}
value=${title}
name=${"title"}
area=${false}
handler=${makeHandler("title")}
/>
</div>


<div class="formRow">

<${TheInput} 
title=${"Author"}
value=${author}
name=${"author"}
area=${false}
handler=${makeHandler("author")}
/>
<div class="divider"></div>
<${TheInput} 
title=${"Keywords"}
value=${keywords}
name=${"keywords"}
area=${false}
handler=${makeHandler("keywords")}
/>
</div>


<${TheInput} 
title=${"Description"}
name=${"description"}
value=${description}
area=${true}
handler=${makeHandler("description")}
/>

<div class="formRow">

<${TheInput} 
title=${"Preview image URL"}
value=${image}
name=${"image"}
area=${false}
handler=${makeHandler("image")}
/>
<div class="divider"></div>
<${TheInput} 
title=${"Icon image URL"}
value=${icon}
name=${"icon"}
area=${false}
handler=${makeHandler("icon")}
/>
</div>

<${TheInput} 
title=${"Footer"}
name=${"footer"}
value=${footer}
area=${true}
handler=${makeHandler("footer")}
/>

<${TheInput} 
title=${"Custom CSS"}
name=${"css"}
area=${true}
value=${customCSS}
handler=${makeHandler("customCSS")}
/>

<label class="label">Embedded data</label>
<${DataUI} signal=${setModified}/> 

<h2 class="subtitle is-3">Helpers API <small>(save and reload required)</small></h2>
<div class="field is-grouped is-grouped-multiline">
<${ CheckBox  }
title="Enable helpers"
checked=${enableHelpers}
onChange=${makeHandler("enableHelpers")}
/>

<${ CheckBox  }
title="Disable interactivity"
checked=${disableInteractivity}
onChange=${makeHandler("disableInteractivity")}
/>
</div>

<h2 class="subtitle is-3">
Advanced <small>(may break everything)</small> 
</h2>

<${TheInput} 
title=${"Custom HTML to HEAD"}
name=${"head"}
area=${true}
value=${headHTML}
handler=${makeHandler("headHTML")}
/>

<${TheInput} 
title=${"Editor location"}
value=${editor}
placeholder="imp.js"
name=${"editor"}
area=${false}
handler=${makeHandler("editor")}
/>

<${TheInput} 
title=${"View CSS location"}
value=${viewCSS}
name=${"viewcss"}
placeholder="style.css"
area=${false}
handler=${makeHandler("viewCSS")}
/>

<div class="buttons">

<input type="button" 
class="button is-dark " 
value="Duplicate file" 
onclick=${ duplicateFile }></input>

<input type="button" 
class="button is-dark ${modified ? "violet" : ""}" 
value="Save file" 
onclick=${ saveHTML }/>
</div>
</div>
`
}
