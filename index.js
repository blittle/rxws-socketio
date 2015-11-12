import { Observable } from 'rx';

import { handleRequest, makeRequest } from './lib/Request';
import { Response } from './lib/Response';

const MESSAGE_TYPE = '__rxwsData';

function sendError(socket, header, errorCode) {
}

export default function(ioSocket) {

	let handlers = [];

	function addRouteHandler(method, resource, options) {
		return Observable.create((observer) => {
			handlers.push({
				name: method + '.' + resource,
				options, observer
			});
		});
	}

	function addMiddleWare(options, observer) {
		return Observable.create((observer) => {
			handlers.push({
				name: 'use',
				options, observer
			});
		});
	}

	ioSocket.on('connection', (socket) => {
		socket.on(MESSAGE_TYPE, (data) => {
			let request = makeRequest(data);
			let response = new Response(request, socket);

			handleRequest(0, handlers, socket, request, response);
		});

		socket.on('disconnect', () => {
			console.log('DISCONNECTED');
			console.log(arguments);
		});
	});

	return {
		get: addRouteHandler.bind(null, 'get'),
		post: addRouteHandler.bind(null, 'post'),
		put: addRouteHandler.bind(null, 'put'),
		delete: addRouteHandler.bind(null, 'delete'),
		patch: addRouteHandler.bind(null, 'patch'),
		head: addRouteHandler.bind(null, 'head'),

		use: addMiddleWare
	}
}
