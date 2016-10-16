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
	$(".message-container").append("<div class='message user-message'>" + marked(text) + "</div>");
}

function postMessage(text) {
	$(".message-container").append("<div class='message'>" + marked(message) + "</div>")
}