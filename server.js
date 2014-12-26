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
	res.sendFile(__dirname + '/index.html'); // Renvoie le fichier index de la SPA.
});

var server = app.listen(8080, '127.0.0.1', function () { // TODO export host and port in a config file.
	var host = server.address().address;
	var port = server.address().port;
	console.log('Server running at %s:%s', host, port);
});

var clientRedis = redis.createClient(); // Se connecte à la BDD Redis.

clientRedis.on('error', function (err) {
	console.log('Redis DB encoutered an error : ' + err);
	// Log l'erreur Redis.
});

clientRedis.on('ready', function () {
	console.log('Redis DB ready.');
	// Log la connection à Redis.
});

// Lorsque qu'une connection websocket est établie.
io.on('connection', function (socket) {


	// On envoie les 5 derniers messages qui ont été persistés dans la BDD Redis, sous l'index lastMessages.
	clientRedis.llen('lastMessages', function (err, len) {
		for (var i = 0; i < len; i++) {
			clientRedis.lindex('lastMessages', i, function (err, message) {
				socket.emit('broadcastMessageToClients', JSON.parse(message)); // Les objets sont stockés sous forme de JSON stringifiés, on doit donc les parser.
			});
		}
	});
	
	// Quand le serveur recoit le message d'un utilisateur.
	socket.on('sendMessageToServer', function (message) {
		message.timestamp = Date.now(); // On ajoute le timestamp cote serveur.

		if (message.roomId) { // Si le message contient un id de room, alors c'est un message privé.
			io.to(message.roomId).emit('privateMessage', message); // On envoie donc le message sur le bon socket.
		} else {
			// Sinon c'est un message public.
			clientRedis.rpush('lastMessages', JSON.stringify(message)); // On persiste en base le message.

			clientRedis.llen('lastMessages', function (err, len) {
				if (len > 5) { // On ne garde que les 5 messages les plus récents.
					clientRedis.lpop('lastMessages');
				};
			});

			io.emit('broadcastMessageToClients', message); // On broadcast le message à tout les utilisateurs.
		}
	});

	socket.on('claimPseudo', function (pseudo) { // Lorsque un utilisateur choisi un pseudo.
		// TODO Check if this pseudo is not already taken.
		
		socket.pseudo = pseudo;

		var user = {
			pseudo: socket.pseudo,
			privateRoomId: uuid.v4() // On lui attribue un uuid qui correspond à sa 'room' websocket.
		};
		console.log('%s is on room %s', user.pseudo, user.privateRoomId);
		socket.join(user.privateRoomId);

		clientRedis.hmset('users', socket.pseudo, JSON.stringify(user)); // On persiste en base l'utilisateur.

		clientRedis.hgetall('users', function (err, usersObj) { // On récupère la liste de tous les utilisateurs.
			var users = [];

			for (var pseudo in usersObj) {
				users.push(pseudo);
			}

			io.emit('updateUsers', users); // On envoie cette liste à tous.
			// TODO Renvoyer individuellement la liste des users en fonction des bans. Voir avec la BDD Redis.
		});

	});

	socket.on('inviteUser', function (pseudo) { // Lorsque l'on veut lancer une conversation privée.
		clientRedis.hget(['users', pseudo], function (err, userObjString) { // On récupère l'utilisateur invité dans la base.
			var invitedUser = JSON.parse(userObjString);

			var room = { // On crée le modèle de donnée de la conversation privée. TODO créer une factory.
				roomId: uuid.v4(),
				users: [],
				messages: []
			};

			room.users.push(socket.pseudo);
			room.users.push(invitedUser.pseudo);

			socket.emit('sendRoom', room); // On envoie la room à l'utilisateur qui a lancé l'invitation.
			io.to(invitedUser.privateRoomId).emit('sendRoom', room); // On envoie la room à l'utilisateur invité.

			clientRedis.hmset('rooms', room.roomId, JSON.stringify(room)); // On persiste la room en base, à toutes fins utiles.
		});
	});

	socket.on('subscribe', function (roomId) { // Quand un utilisateur veut entrer dans une room websocket.
		socket.join(roomId);
		console.log('%s subscribe to %s', socket.pseudo, roomId);
	});

	socket.on('leaveRoom', function (roomId) { // Quand un utilisateur veut quitter une room websocket.
		socket.leave(roomId);
	});

	socket.on('disconnect', function () { // Lorsqu'une connection websocket est fermée/
		if (socket.pseudo) {
			clientRedis.hdel('users', socket.pseudo); // On supprime l'utilisateur de la base Redis.

			clientRedis.hgetall('users', function (err, usersObj) {
				var users = [];

				for (var pseudo in usersObj) {
					users.push(pseudo);
				}

				// TODO Renvoyer individuellement la liste des users en fonction des bans. Voir avec la BDD Redis.
				io.emit('updateUsers', users);
			});
		}
	});

	// TODO Ajouter un evenement qui ecoute le ban d'une personne, persister cette personne dans la base Redis
	// users : { pseudo : [pseudo: '', privateRoomId: '', bannedBy: ['pseudo1', 'pseudo2', ...]]}
});

io.listen(server);