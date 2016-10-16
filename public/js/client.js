var socket = io();
var user_id = 0,
	session = null;

socket.on('hello', function() {
	presentLogIn();
});

socket.on('authenticated', function(new_session) {
	//set up views and stuff, cache/save session.
	sesssion = new_session
	presentChat();
});

socket.on('authentication failed', function(error) {
	//show appropriate error.
});

socket.on('update user list', function() {
	socket.emit('request users', session.token);
});

socket.on('new message', function(message) {
	if(message.user_id == user_id){
		return;
	}
	postMessage(message.text);
});

//Not sure if this is belongs here or in default.js
$("#message-form").submit(function() {
	var text = $('#message').val();
	if(text.length == 0 || text == "\n" || text == ''){
		$('#message').val('');
		return false;
	}
	message = {text: text, user_id: user_id, nickname: session.nickname}
	socket.emit('new message', message);
	postUserMessage(text);
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