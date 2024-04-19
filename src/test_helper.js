(
  ()=>{
    const helper = {
      render: ( params , params_raw, subname )=>`<div data-ihelper='test_helper'
      style="width: 100% ; border: 2px solid gray; box-sizing: border-box;
      padding: 24px"
      >STATIC</div>`,

      preview: ( params , params_raw , subname )=>`<div data-ihelper='test_helper'
      style="width: 100% ; border: 2px solid gray; box-sizing: border-box;
      padding: 24px"
      >PREVIEW</div>`,

      animate: (el)=>el.innerHTML="ANIMATED",
      //some POSSIBLE attributes

      init: ()=>console.log("initialize test_helper" ),

    }
    console.info("Test helper is about to register....")
    window.impHelpers && window.impHelpers.register("test_helper" , helper , "yaml")
  }
)()
