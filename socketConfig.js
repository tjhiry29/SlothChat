/*
* Register and sign on flow.
*	1. Register/sign on by inputting a nickname. (Must be unique)
*	2. If authentication is a success we generate a token for the user. (Hash random salt + nickname)
*	3. Client requests active users list.
*	4. Return active users
*/

/*
* Once connected:
*	1. If a user connects successfully, we push updated user lists
*	2. 
*/

//Variables.

var message_id = 0,
	user_id = 0,
	server_id = 13371337,
	db = null;

function use(socket, db){
	db = db;
	socket.on('connection', function(client){
		console.log("User has connected: " + user_id++);
		socket.emit('hello');

		client.on('authenticate', function(user){
			//check db for user.

			//if valid user or we've registered or whatever the fuck.
			//socket.emit('authenticated', session);
			//socket.emit('new message', message);
		});

		client.on('request users', function(token){
			//return list of active users.
			//socket.emit('active users', active_users);
		});

		client.on('disconnect', function(){
			console.log("A user has disconnected");
		});

		client.on('new message', function(message){
			message = {text: message.text, id: message_id++, user_id: message.user_id}
			socket.emit('new message', message);
			console.log("new message: %j", message);
		});
	});
}

function newUserMessage(user){
	var message = {text: ("User %s has connected", user.name), id: message_id++, user_id: server_id}
}

function generateToken(user){

}

module.exports = {
	use: use
}