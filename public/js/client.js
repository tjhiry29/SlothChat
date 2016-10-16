var socket = io();
var user_id = 0,
	session = null;

socket.on('hello', function() {
	//receive hello and force user to log-in/register

	//hide message interface.
	//show registration interface.

	//send user info.
});

socket.on('authenticated', function(session) {
	//set up views and stuff, cache/save session.
	//socket.emit('request users', session.token);
});

socket.on('authentication failed', function(error) {
	//show appropriate error.
});

socket.on('update user list', function(){
	//socket.emit('request users', session.token);
});

socket.on('new message', function(message) {
	if(message.user_id == user_id){
		return;
	}
	postMessage(message.text);
});

$("#message_form").submit(function(){
	var text = $('#message').val();
	if(text.length == 0 || text == "\n" || text == ''){
		$('#message').val('');
		return false;
	}
	message = {text: text, user_id: user_id}
	socket.emit('new message', message);
	postUserMessage(text);
	return false;
});

//login form.submit
//socket.emit('authenticate', user);