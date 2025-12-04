//= require active_admin/base
//= require activeadmin/quill_editor/quill
//= require activeadmin/quill_editor_input

// Fix for invalid selector :has(*,:jqfake) error in ActiveAdmin
// Override querySelector to handle invalid selectors gracefully
(function() {
  const originalQuerySelector = document.querySelector;
  const originalQuerySelectorAll = document.querySelectorAll;
  
  document.querySelector = function(selector) {
    try {
      return originalQuerySelector.call(document, selector);
    } catch (e) {
      if (selector && selector.includes(':jqfake')) {
        console.warn('Invalid selector caught and ignored:', selector);
        return null;
      }
      throw e;
    }
  };
  
  document.querySelectorAll = function(selector) {
    try {
      return originalQuerySelectorAll.call(document, selector);
    } catch (e) {
      if (selector && selector.includes(':jqfake')) {
        console.warn('Invalid selector caught and ignored:', selector);
        return [];
      }
      throw e;
    }
  };
})();

let current_url = window.location.href

$(document).ready(function(){
	if (window.location.href.includes("admin/coach_availabilities/")){
		for ( let j = 2; j<3; j++ ){for (let i = 2; i<=4; i++){
		   document.getElementsByClassName("button has_many_remove")[i]?.remove() 
		   document.getElementsByClassName("button has_many_add")[i]?.remove() 
			}}
	}
	})





