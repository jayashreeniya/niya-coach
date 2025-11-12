//= require active_admin/base
//= require activeadmin/quill_editor/quill
//= require activeadmin/quill_editor_input

let current_url = window.location.href

$(document).ready(function(){
	if (window.location.href.includes("admin/coach_availabilities/")){
		for ( let j = 2; j<3; j++ ){for (let i = 2; i<=4; i++){
		   document.getElementsByClassName("button has_many_remove")[i]?.remove() 
		   document.getElementsByClassName("button has_many_add")[i]?.remove() 
			}}
	}
	})





