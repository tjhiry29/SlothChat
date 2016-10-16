/*
* Register and sign on flow.
*	1. Register/sign on by inputting a nickname. (Must be unique)
*	2. If authentication is a success we generate a token for the user. (Hash random salt + nickname + client.client.conn.id)
*	3. Client requests active users list.
*	4. Return active users
*/

/*
* Once connected:
*	1. If a user connects successfully, we request users return their tokens for active user lists.
*	2. When we get tokens we return active user lists.
*	3. We verify tokens on EVERY action.
*/

//Variables.

var message_id = 0,
	user_id = 0,
	server_id = 13371337,
	db = null,
	active_users = [];

let sha256 = require('js-sha256').sha256;

function use(socket, db) {
	db = db;
	socket.on('connection', function(client) {
		console.log("User has connected: " + active_users.length++);
		active_users.push(client.client.conn.id);
		socket.emit('hello');

		client.on('authenticate', function(user) {
			//check db for user nickname.
			//if not valid user (usually same nickname, but there might be something else later);
			//socket.emit('authentication failed', "same nickname");

			//if valid user or we've registered or whatever the fuck.
			//socket.emit('authenticated', session);
			//socket.emit('new message', message);
			//socket.emit('update user list');
		});

		client.on('request users', function(token) {
			//return list of active users.
			//socket.emit('active users', active_users);
		});

		client.on('disconnect', function() {
			active_users.slice(active_users.indexOf(client.client.conn.id), 1);
			console.log("A user has disconnected");
		});

		client.on('new message', function(message) {
			message = {text: message.text, id: message_id++, user_id: message.user_id}
			socket.emit('new message', message);
			console.log("new message: %j", message);
		});
	});
}

function newUserMessage(user) {
	var message = {text: ("User %s has connected", user.name), id: message_id++, user_id: server_id}
}

function generateToken(user) {
	// Hash random salt plus user nickname.
	// KEEP THE TOKEN
}

module.exports = {
	use: use
}