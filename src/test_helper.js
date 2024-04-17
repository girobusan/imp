(
  ()=>{
    const th = {
      render: ()=>`<div data-ihelper='test_helper'
      style="width: 100% ; border: 2px solid gray; box-sizing: border-box;
      padding: 24px"
      >STATIC</div>`,
      animate: (el)=>el.innerHTML="ANIMATED",
      //some POSSIBLE attributes
      init: ()=>console.log("initialize test_helper" ),
      paramFormat: ()=>"raw"

    }
    console.info("Test helper is about to register....")
    window.impHelpers && window.impHelpers.register("test_helper" , th , "raw")
  }
)()
