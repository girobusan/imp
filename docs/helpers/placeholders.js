(()=>{var e;function t(t,r,i){const n=t.title||"title",l=t.text||"Some text";switch(i){case"error":return e.errorNotice(n,l);case"render":return e.defaultRender(t.title||"title",{},"","");default:return e.defaultPreview(n,l)}}window.impHelpers.register("placeholders",{render:t,preview:function(e,r,i){return t(e,0,i)},init:function(t){e=t}},"yaml")})();