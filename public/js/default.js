//Front end Javascript
var chat = null,
	login = null,
	errors = null,
	message = null,
	message_container = null,
	message_form = null;

$(document).ready(function() {
	chat = $("#chat");
	login = $("#login");
	errors = $("#error");
	message = $("#message");
	message_container = $(".message-container");
	message_form = $("#message-form");
	//When enter is pressed without any other key send a message.
	message.keypress(function(e) {
		if(e.which == 13 && !e.shiftKey){
			message_form.submit();
			e.preventDefault(); //Don't let it create a new line.
			return false;
		}
	});
});

function presentError(error) {
	$("<div>", {
		class: "error",
	}).append(marked(error)).appendTo(errors);
}

function hideError() {
	$(".error").remove();
}	

function presentLogIn() {
	chat.hide();
	login.show();
}

function presentChat() {
	chat.show();
	login.hide();
}

function clearUserList() {
	var children = $(".users").children();
	if(children == null || children.length == 0) {
		return;
	}
	children.remove();
}

function addUserToList(session_to_add) {
	$("<p>", {
		class: 'user'
	}).text(session_to_add.nickname).appendTo($(".users"));
}

function postUserMessage(message) { 
	$("#message").val('');
	$("<div>", {
		class: "message"
	}).append("<p class='message-from'>"+message.nickname+":</p>").append(marked(message.text)).appendTo(message_container);
	$(".message-display").scrollTop($(".message-display")[0].scrollHeight)
}

function postMessage(message) {
	$("<div>", {
		class: "message"
	}).append("<p class='message-from'>"+message.nickname+":</p>").append(marked(message.text)).appendTo(message_container);
	$(".message-display").scrollTop($(".message-display")[0].scrollHeight)
}