//Front end Javascript

$(document).ready(function() {
	$("#message").keypress(function(e) {
		if(e.which == 13 && !e.shiftKey){
			$("#message_form").submit();
			e.preventDefault();
			return false;
		}
	});
});

function presentLogIn(){

}

function presentChat(){

}

function postUserMessage(text) { 
	$("#message").val('');
	$("<div>", {
		class: "message user-message"
	}).append(marked(text)).appendTo(".message-container");
}

function postMessage(text) {
	$("<div>", {
		class: "message"
	}).append(marked(text)).appendTo(".message-container");
}