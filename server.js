//to view es6 capabilities see http://node.green/
//node v8-options es6 module syntax currently under development (2016/06/25)
let path         = require('path');
let express      = require('express');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let routes       = require('./routes');
let socketConfig = require('./socketConfig');
let io 			 = require('socket.io');
let marked 		 = require('marked');
let loki		 = require('lokijs');

//setup
let app      	 = express();
let db			 = new loki('database.loki', { autoload: true, autosave: true});

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

//server and socket
let server = app.listen(app.get('port'), () => console.log('Listening on http://localhost:' + app.get('port')));
let socket = io.listen(server);
socketConfig.use(socket, db);

