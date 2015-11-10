let rxws = require('rxws-socketio');

function rxHandler(rxSocket) {
	/** Middleware **/
	rxSocket.use((req, res, next) => {
		req.requestTime = Date.now();
		next();
	});

	/** RestFul Listeners **/
	rxSocket.put('questions' (req, res) => {});
	rxSocket.post('questions' (req, res) => {});
	rxSocket.delete('questions' (req, res) => {});
	rxSocket.patch('questions' (req, res) => {});

	rxSocket.get('questions')
		.subscribe((req, res) => {

			/** Req API **/
			req.headers
			req.resource
			req.method
			req.parameters
			req.query
			req.body

			/** Res API **/
			res.headers
			res.body
			res.statusCode = 404;
			res.setHeader('name', 'value');
			res.getHeader('name');
			res.removeHeader('name');
			res.send({data: ""})

			res.status(500).send('Something broke!');
		});
}

/** HTTP Server Example **/
var io = require('socket.io')(server);
io.on('connection', function(socket) {
	rxws(socket)(rxHandler);
});

server.listen(3000);

/** SocketIo Server Example **/
var io = require('socket.io')();
io.on('connection', function(socket) {
	rxws(socket)(rxHandler);
});
io.listen(3000);

/** Express Server Example **/
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(socket) {
	rxws(socket)(rxHandler);
});
server.listen(3000);
