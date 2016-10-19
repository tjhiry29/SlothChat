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
	active_users = [],
	db = null,
	sessions = null,
	tokens = [];

let sha256 = require('js-sha256').sha256;

function use(socket, db) {
	//db setup
	setUpDB(db);
	socket.on('connection', function(client) {
		active_users.push(client.client.conn.id);
		console.log("User has connected: " + client.client.conn.id);
		socket.to(client.id).emit('hello');

		client.on('authenticate', function(nickname) {
			//check db for user nickname.
			var same_nicknames = sessions.find({nickname: nickname});
			if(same_nicknames.length > 0){
				socket.to(client.id).emit('authentication failed', "A user already has this nickname, please choose another");
			}
			else { //Must be valid at this point.
				var session = createSession(client.client.conn.id, nickname);
				saveSession(session);
				socket.to(client.id).emit('authenticated', session);
				socket.emit('new message', newUserMessage(nickname));
				socket.emit('update user list');
			}
		});

		client.on('request users', function(token) {
			//return list of active users.
			if(tokens.indexOf(token) == -1) {
				return;
			}
			socket.emit('user list', sessions.data)
		});

		client.on('disconnect', function() {
			var index = active_users.indexOf(client.client.conn.id);
			if(index != -1) {
				active_users.slice(index, 1);
			}
			var session_to_remove = sessions.find({id: client.client.conn.id})
			sessions.remove(session_to_remove);
			index = tokens.indexOf(session_to_remove.token);
			if(index != -1) {
				tokens.slice(index, 1);
			}
			socket.emit('update users list');
			socket.emit('new message', userDisconnectedMessage(session_to_remove.nickname))
			console.log("A user has disconnected");
		});

		client.on('new message', function(message) {
			//Assign a message id
			message = {text: message.text, id: message_id++, user_id: message.user_id, nickname: message.nickname}
			socket.emit('new message', message);
			console.log("new message: %j", message);
		});
	});
}

function setUpDB(db) {
	sessions = db.addCollection('sessions');
}

function newUserMessage(nickname) {
	var message = {text: ("User '" + nickname + "' has connected."), id: message_id++, user_id: server_id, nickname: "Server"}
	return message;
}

function userDisconnectedMessage(nickname) {
	var message = {text: ("User '" + nickname + "' has connected."), id: message_id++, user_id: server_id, nickname: "Server"}
	return message;
}

function generateToken(client_id, nickname) {
	var token = sha256(client_id + nickname);
	tokens.push(token);
	// KEEP THE TOKEN
	return token;
}

function createSession(client_id, nickname){
	var session = {
		id: client_id, 
		token: generateToken(client_id, nickname),
		user_id: user_id++,
		nickname: nickname
	}
	return session;	
}

function saveSession(session) {
	sessions.insert(session);
}

module.exports = {
	use: use
}