# RxWS SocketIO
Reactive Web Sockets on top of SocketIO

Status: [![Build Status](https://travis-ci.org/blittle/rxws-socketio.png?branch=master)](https://travis-ci.org/blittle/rxws-socketio) [![codecov.io](https://codecov.io/github/blittle/rxws-socketio/coverage.svg?branch=master)](https://codecov.io/github/blittle/rxws-socketio?branch=master)

RxWS is a RESTful reactive JavaScript implementation on top of web sockets. This includes, GET, POST, PUT, REMOVE (DELETE), PATCH, and HEAD. RxWS guarantees message delivery by generating a correlation id for each message (to and from the server). Both the server and client automatically send an acknowledgement response for each request. If there is no acknowledgement after a timeout, an error is thrown.

RxWS implements a [RESTful protocol](https://github.com/blittle/rxws-socketio/blob/master/protocol.md). You can use any web socket server as long as it implements the same protocol.

## Client library
The client library is available at https://github.com/CanopyTax/rxws

## Setup
`npm install --save rxws-socketio socket.io`

## Example
```javascript
// Server
import io from 'socket.io';
import rxws from 'rxws-socketio';

let server = io(3000);

function rxHandler(rxSocket) {
	rxSocket.get('questions')
		.subscribe(({req, res, next}) => {
			res.send([
				{
					id: 1,
					name: 'userName',
					label: 'What is your name?'
				}
			])
		});
}

server.on('connection', function(socket) {
	rxHandler(rxws(socket));
});
```

```javascript
// Client
import rxws from 'rxws';
import SocketIOBackend from 'rxws-socketio/lib/SocketIOBackend';

rxws.setBackend({
	backend: SocketIOBackend.default,
	url: 'http://localhost:3000'
});

setInterval(function() {
	rxws.get('questions')
		.subscribe(function(resp) {
			console.log(resp.questions);
		});
}, 1000);
```

## API
```javascript
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
 * Error middleware handler
 *
 * @param {object} options An options object. Unused at the moment.
 * @return {Observable} Observable is passed an object with an error object, the
 *                 request, response, and next method. Calling next will route
 *                 to the next error handling middleware.
 */
rxSocket.useError(options)
	.subscribe(({err, req, res, next}) => {
		console.error(err.stack);
		res.status(500).send('Something broke!');
	});

/**
 * RESTful methods are available on rxSocket
 *
 * @param {string} Resource a dot separated path to the resource being requested.
 *                 The only available parameters for a given resource are parameters
 *                 that match a given resource. For example, the resource 'questions'
 *                 can only take a 'questions' parameter. Anything else will error.
 *                 Nested resources need to have each resource represented with a
 *                 parameter except for the last resource, which is optional.
 * @return {Observable} The observable can only be passed a single value, that value
 *                 must be destructured to get both the request and response.
 */
rxSocket.get('questions')
	.subscribe(({req, res, next}) => {
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
rxSocket.put('questions').subscribe(({req, res, next}) => {});
rxSocket.post('questions').subscribe(({req, res, next}) => {});
rxSocket.patch('questions').subscribe(({req, res, next}) => {});
rxSocket.delete('questions').subscribe(({req, res, next}) => {});
rxSocket.head('questions').subscribe(({req, res, next}) => {});

/**
 * Server sent messages - possible other verbs? send, emit, write
 *
 * @param {string} messageKey A unique message key which the client can subscribe to
 * @param {any} data An arbitrary data value sent to the client
 */
rxSocket.push('newPost', {some: 'data'});
```
