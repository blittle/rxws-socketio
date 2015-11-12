let rxws = require('rxws-socketio');

function rxHandler(rxSocket) {
	/**
	 * Middleware handler - The middleware is executed in the order that it is defined.
	 *
	 * @param {object} options An options object passed to the middleware
	 * @return {Observable} An obserable with the request and response object which may
	 *                be manipulated.
	 */
	rxSocket.use(options)
		.subscribe(({req, res, next}) => {
			req.requestTime = Date.now();
			next();
		});

	/**
	 * RESTful methods are available on rxSocket
	 *
	 * @param {string} Resource a dot separated path to the resource being requested.
	 *                 The only available parameters for a given resource are parameters
	 *                 that match a given resource. For example, the resource 'questions'
	 *                 can only take a 'questions' parameter. Anything else will error.
	 *                 Nested resources need to have each resource represented with a
	 *                 parameter except for the last resource, which it is optional.
	 * @param {object} options An options object which may contain an array of
	 *                 available query parameters. Any query parameter passed that
	 *                 is not included will throw an error.
	 *
	 * @return {Observable} The observable can only be passed a single value, that value
	 *                 must be destructured to get both the request and response.
	 */
	rxSocket.get('questions', {query: ['name']})
		.subscribe(({req, res}) => {
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
			res.send({data: ""});

			res.status(500).send('Something broke!');
		})

	/** RestFul Listeners **/
	rxSocket.put('questions').subscribe(({req, res}) => {});
	rxSocket.post('questions').subscribe(({req, res}) => {});
	rxSocket.patch('questions').subscribe(({req, res}) => {});
	rxSocket.delete('questions').subscribe(({req, res}) => {});
	rxSocket.head('questions').subscribe(({req, res}) => {});

	/**
	 * Server sent messages - possible other verbs? send, emit, write
	 *
	 * @param {string} messageKey A unique message key which the client can subscribe to
	 * @param {any} data An arbitrary data value sent to the client
	 */
	rxSocket.push('newPost', {some: 'data'});
}

/** HTTP Server Example **/
let io = require('socket.io')(server);
io.on('connection', function(socket) {
	rxHandler(rxws(socket));
});

server.listen(3000);

/** SocketIo Server Example **/
let io = require('socket.io')();
io.on('connection', function(socket) {
	rxHandler(rxws(socket));
});
io.listen(3000);

/** Express Server Example **/
let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
io.on('connection', function(socket) {
	rxHandler(rxws(socket));
});
server.listen(3000);
