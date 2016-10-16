//Front end Javascript

$(document).ready(function() {
	//When enter is pressed without any other key send a message.
	$("#message").keypress(function(e) {
		if(e.which == 13 && !e.shiftKey){
			$("#message-form").submit();
			e.preventDefault();
			return false;
		}
	});
});

function presentError(error) {
	$("<div>", {
		class: "error",
	}).append(marked(error)).appendTo($("#error"));
}

function hideError() {
	$(".error").remove();
}	

function presentLogIn() {
	$("#chat").hide();
	$("#login").show();
}

function presentChat() {
	$("#chat").show();
	$("#login").hide();
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