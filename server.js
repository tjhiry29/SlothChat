//to view es6 capabilities see http://node.green/
//node v8-options es6 module syntax currently under development (2016/06/25)
let path         = require('path');
let express      = require('express');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let routes       = require('./routes');
let io 			 = require('socket.io');

//setup
let app      	 = express();

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static('public'));

//router
routes.create(app);

//server
let server = app.listen(app.get('port'), () => console.log('Listening on http://localhost:' + app.get('port')));
let socket = io.listen(server);
var current_user_id = 0;

socket.on('connection', function(client){
	console.log("User has connected");

	client.on('disconnect', function(){
		console.log("A user has disconnected");
	});

	client.on('new message', function(message){
		// client.newMessage(message);
		socket.emit('new message', message);
		console.log("new message: " + message);
	});
});
