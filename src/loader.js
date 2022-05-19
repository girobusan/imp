
window.addEventListener("DOMContentLoaded" , function(){
  // console.log("HASH" , window.location.hash);
  if(
  //window.location.protocol==="file:" || 
  window.location.hash ==="#edit"){
    console.info("We're opened for editing");
     IMPEdit();
  }
})

function IMPEdit(){

    const head = document.head;
    window.savedHead = head.innerHTML;//.clone(true);
    const editor = document.createElement("script");
    editor.id="editorScript";
    editor.src="editor.js";
    head.appendChild(editor);
}

