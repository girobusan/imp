
window.addEventListener("DOMContentLoaded" , function(){
  // console.log("I am" , window.location)
  function IMPEdit(){
    console.info("Edit mode.")
    const head = document.head;
    window.savedHead = head.innerHTML;//.clone(true);
    const editor = document.createElement("script");
    editor.id="editorScript";
    editor.src="imp.js";
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

window.addEventListener("hashchange", ()=>history.go(0));


