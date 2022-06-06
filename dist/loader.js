/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./src/loader.js ***!
  \***********************/

window.addEventListener("DOMContentLoaded" , function(){
  // console.log("I am" , window.location)
  function IMPEdit(){
    console.info("Edit mode.")
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

window.addEventListener("hashchange", ()=>history.go(0));



/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ltcC8uL3NyYy9sb2FkZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiICwgZnVuY3Rpb24oKXtcclxuICAvLyBjb25zb2xlLmxvZyhcIkkgYW1cIiAsIHdpbmRvdy5sb2NhdGlvbilcclxuICBmdW5jdGlvbiBJTVBFZGl0KCl7XHJcbiAgICBjb25zb2xlLmluZm8oXCJFZGl0IG1vZGUuXCIpXHJcbiAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZDtcclxuICAgIHdpbmRvdy5zYXZlZEhlYWQgPSBoZWFkLmlubmVySFRNTDsvLy5jbG9uZSh0cnVlKTtcclxuICAgIGNvbnN0IGVkaXRvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiAgICBlZGl0b3IuaWQ9XCJlZGl0b3JTY3JpcHRcIjtcclxuICAgIGVkaXRvci5zcmM9XCJlZGl0b3IuanNcIjtcclxuICAgIGhlYWQuYXBwZW5kQ2hpbGQoZWRpdG9yKTtcclxuICB9XHJcblxyXG4gIFxyXG4gIHZhciBpbklmcmFtZSA9IGZhbHNlO1xyXG4gIHRyeXtcclxuICAgIGluSWZyYW1lID0gd2luZG93LnNlbGYhPXdpbmRvdy50b3A7XHJcbiAgfWNhdGNoKGUpe1xyXG4gICBpbklmcmFtZSA9IHRydWU7XHJcbiAgfVxyXG4gIGlmKGluSWZyYW1lKXtyZXR1cm47fVxyXG5cclxuICBpZih3aW5kb3cubG9jYXRpb24uaGFzaD09PVwiI3ZpZXdcIil7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBpZih3aW5kb3cubG9jYXRpb24uaGFzaCA9PT1cIiNlZGl0XCIpe1xyXG4gICAgSU1QRWRpdCgpO1xyXG4gIH1cclxuICBpZih3aW5kb3cubG9jYXRpb24ucHJvdG9jb2w9PT1cImZpbGU6XCIpe1xyXG4gICAgSU1QRWRpdCgpO1xyXG4gIH1cclxufSlcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLCAoKT0+aGlzdG9yeS5nbygwKSk7XHJcblxyXG5cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9