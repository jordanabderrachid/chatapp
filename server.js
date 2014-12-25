var express     = require('express');
var serveStatic = require('serve-static');
var morgan 		= require('morgan');
var io			= require('socket.io')();

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

io.on('connection', function (socket) {
	console.log('Connection !');
});

io.listen(server);