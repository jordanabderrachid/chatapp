var express     = require('express');
var serveStatic = require('serve-static');
var morgan 		= require('morgan');
var io			= require('socket.io')();
var redis		= require('redis');
var uuid 		= require('uuid');

var app = express();

app.use(morgan('dev')); // Logger.

app.use(serveStatic('public', {})); // Used to serve static content.

app.get('*', function (req, res, next) {
	res.sendFile(__dirname + '/index.html');
});

var server = app.listen(8080, '127.0.0.1', function () { // TODO export host and port in a config file.
	var host = server.address().address;
	var port = server.address().port;
	console.log('Server running at %s:%s', host, port);
});

var clientRedis = redis.createClient();

clientRedis.on('error', function (err) {
	console.log('Redis DB encoutered an error : ' + err);
});

clientRedis.on('ready', function () {
	console.log('Redis DB ready.');
});

io.on('connection', function (socket) {

	clientRedis.llen('lastMessages', function (err, len) {
		for (var i = 0; i < len; i++) {
			clientRedis.lindex('lastMessages', i, function (err, message) {
				socket.emit('broadcastMessageToClients', JSON.parse(message));
			});
		}
	});
	
	socket.on('sendMessageToServer', function (message) {
		message.timestamp = Date.now();

		clientRedis.rpush('lastMessages', JSON.stringify(message));

		clientRedis.llen('lastMessages', function (err, len) {
			if (len > 5) {
				clientRedis.lpop('lastMessages');
			};
		});

		io.emit('broadcastMessageToClients', message);
	});

	socket.on('claimPseudo', function (pseudo) {
		// TODO Check if this pseudo is not already taken.
		
		socket.pseudo = pseudo;

		var user = {
			pseudo: socket.pseudo,
			privateRoomId: uuid.v4()
		};

		socket.join(user.privateRoomId);

		clientRedis.hmset('users', socket.pseudo, JSON.stringify(user));

		clientRedis.hgetall('users', function (err, usersObj) {
			var users = [];

			for (var pseudo in usersObj) {
				users.push(pseudo);
			}

			io.emit('updateUsers', users);
		});

	});

	socket.on('disconnect', function () {
		if (socket.pseudo) {
			clientRedis.hdel('users', socket.pseudo);

			clientRedis.hgetall('users', function (err, usersObj) {
				var users = [];

				for (var pseudo in usersObj) {
					users.push(pseudo);
				}

				io.emit('updateUsers', users);
			});
		}
	});

	console.log('Connection !');
});

io.listen(server);