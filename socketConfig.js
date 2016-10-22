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
	channel_id = 1,
	server_id = 13371337,
	active_users = [],
	db = null,
	sessions = null,
	tokens = [],
	channels = null,
	default_channel = 0,
	messages = null;

let sha256 = require('js-sha256').sha256;

function use(socket, db) {
	//db setup
	setUpDB(db);
	socket.on('connection', function(client) {
		active_users.push(client.id);
		console.log("User has connected: " + client.id);
		socket.to(client.id).emit('hello');

		client.on('authenticate', function(nickname) {
			//check db for user nickname.
			var same_nicknames = sessions.find({nickname: nickname});
			if(same_nicknames.length > 0){
				socket.to(client.id).emit('authentication failed', "A user already has this nickname, please choose another");
			}
			else { //Must be valid at this point.
				var session = createSession(client.id, nickname);
				saveSession(session);
				client.join(default_channel);
				socket.to(client.id).emit('authenticated', session);
				socket.to(default_channel).emit('update user list');
				socket.to(default_channel).emit('new message', newUserMessage(nickname, default_channel));
			}
		});

		client.on('request users', function(channel_id) {
			//return list of active users.
			if(channels.find({channel_id: channel_id}) == null) {
				return;
			}
			socket.emit('user list', sessions.find({channel_id: channel_id}))
		});

		client.on('disconnect', function() {
			var index = active_users.indexOf(client.id);
			if(index != -1) {
				active_users.slice(index, 1);
			}
			var session_to_remove = sessions.find({id: client.id})
			sessions.remove(session_to_remove);
			index = tokens.indexOf(session_to_remove.token);
			if(index != -1) {
				tokens.slice(index, 1);
			}
			socket.to(session_to_remove.channel_id).emit('update users list');
			socket.to(session_to_remove.channel_id).emit('new message', userDisconnectedMessage(session_to_remove.nickname, session_to_remove.channel_id))
			console.log("A user has disconnected");
		});

		client.on('new message', function(message) {
			//Assign a message id
			message = {text: message.text, id: message_id++, user_id: message.user_id, nickname: message.nickname, channel_id: message.channel_id}
			saveMessage(message);
			socket.to(message.channel_id).emit('new message', message);
			console.log("new message: %j", message);
		});

		client.on('request messages', function(session){
			var messages_to_send = messages.find({channel_id: session.channel_id});
			socket.to(client.id).emit('update messages', messages_to_send);
		});

		client.on('create channel', function(name){
			channel_to_add = createChannel(name);
			saveChannel(channel_to_add);
		});

		client.on('change channel', function(session, channel_id_to_join){
			var channel_id_to_leave = session.channel_id;
			sessions.remove(session);
			session.channel_id = channel_id_to_join;
			socket.to(channel_id_to_leave).emit('update users list');
			socket.to(channel_id_to_leave).emit('new message', userDisconnectedMessage(session.nickname, channel_id_to_leave));
			saveSession(session);
			socket.to(client.id).emit('update session', session);
			client.join(channel_id_to_join);
			socket.to(channel_id_to_join).emit('update users list');
			socket.to(channel_id_to_join).emit('new message', newUserMessage(session.nickname, channel_id_to_join));
		});

	});
}

function setUpDB(db) {
	sessions = db.addCollection('sessions');
	channels = db.addCollection('channels');
	messages = db.addCollection('messages');
	channels.insert({channel_id: 0, name: "General"})
}

function newUserMessage(nickname, channel_id) {
	var message = {text: ("User '" + nickname + "' has connected."), id: message_id++, user_id: server_id, nickname: "Server", channel_id: channel_id}
	saveMessage(message);
	return message;
}

function userDisconnectedMessage(nickname, channel_id) {
	var message = {text: ("User '" + nickname + "' has connected."), id: message_id++, user_id: server_id, nickname: "Server", channel_id: channel_id}
	saveMessage(message);
	return message;
}

function channelJoinedMessage(channel_id){
	var message = {text: ("You have joined channel " + channel_id), id: message_id++, user_id: server_id, nickname: "Server", channel_id: channel_id}
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
		nickname: nickname,
		channel_id: 0
	}
	return session;	
}

function createChannel(name){
	var channel = {
		channel_id: channel_id++,
		name: name
	}
	return channel
}

function saveChannel(channel){
	channels.insert(channel);
}

function saveSession(session) {
	sessions.insert(session);
}

function saveMessage(message) {
	messages.insert(message);
}

module.exports = {
	use: use
}