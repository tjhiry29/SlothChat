var socket = io();
var user_id = 0,
	session = null;

socket.on('hello', function() {
	presentLogIn();
});

socket.on('authenticated', function(new_session) {
	//set up views and stuff, cache/save session.
	session = new_session
	presentChat();
});

socket.on('authentication failed', function(error) {
	//show appropriate error.
	presentError(error);
});

socket.on('update user list', function() {
	socket.emit('request users', session.token);
});

socket.on('user list', function(sessions) {
	clearUserList();
	sessions.forEach(function(session_to_add){
		addUserToList(session_to_add);
	});
});

socket.on('new message', function(message) {
	if(message.user_id == session.user_id){
		return;
	}
	postMessage(message);
});

//Not sure if this is belongs here or in default.js
$("#message-form").submit(function() {
	var text = $('#message').val();
	if(text.length == 0 || text == ''){
		$('#message').val('');
		return false;
	}
	message = {text: text, user_id: session.user_id, nickname: session.nickname}
	socket.emit('new message', message);
	postUserMessage(message);
	return false;
});

$("#message-submit").on('click', function(){
	$("#message-form").submit();
	return false;
});

$("#login-form").submit(function() {
	//TODO: clean nickname.
	var nickname = $("#nickname").val();
	if(nickname.length == 0) {
		return false;
	}
	hideError(); //If there are any errors, remove them.
	$("#nickname").val('');
	socket.emit('authenticate', nickname);
	return false;
});