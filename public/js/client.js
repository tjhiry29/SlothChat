var socket = io();

$("#message_form").submit(function(){
	var message = $('#message').val();
	if(message.length == 0){
		return false;
	}
	socket.emit('new message', message);
	$("#message").val('');
	$(".message-container").append("<div class='message user-message'>" + message + "</div>");
	return false;
});

socket.on('user connected', function(user){
	$('.users').append("<p class='user'>" + user + "</p>");
	console.log('connected');
});