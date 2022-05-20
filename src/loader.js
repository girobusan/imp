
window.addEventListener("DOMContentLoaded" , function(){
  console.log("I am" , window.location)
  function IMPEdit(){
    console.log("Edit mode.")
    const head = document.head;
    window.savedHead = head.innerHTML;//.clone(true);
    const editor = document.createElement("script");
    editor.id="editorScript";
    editor.src="editor.js";
    head.appendChild(editor);
  }
  var inIframe = false;
  try{
    inIframe = window.self!=window.top;
  }catch(e){
   inIframe = true;
  }
  if(inIframe){return;}

  if(window.location.hash==="#view"){
    return;
  }

  if(window.location.hash ==="#edit"){
    IMPEdit();
  }
  if(window.location.protocol==="file:"){
    IMPEdit();
  }
})


