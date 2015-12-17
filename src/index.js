import { Observable } from 'rx';

import getDefaultErrorHandler from './default-error-handler';
import { handleRequest, makeRequest } from './Request';
import { Response } from './Response';
import { MESSAGE_TYPE } from './constants';

export default function(ioSocket) {

	let handlers = [];
	let errorHandlers = [];

	getDefaultErrorHandler((errorHandler) => {
		errorHandlers = [ ...errorHandlers, errorHandler ];
	});

	function addRouteHandler(method, resource, options) {
		return Observable.create((observer) => {
			handlers.push({
				name: method + '.' + resource,
				options, observer
			});
		});
	}

	function addErrorMiddleWare(options) {
		return Observable.create((observer) => {
			let defaultHandler = errorHandlers.pop();

			errorHandlers.push({
				options, observer
			});

			errorHandlers.push(defaultHandler);
		});
	}

	function addMiddleWare(options) {
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

			handleRequest(0, handlers, errorHandlers, request, response);
		});
    //
		// socket.on('disconnect', () => {
		// });
	});

	return {
		get: addRouteHandler.bind(null, 'get'),
		post: addRouteHandler.bind(null, 'post'),
		put: addRouteHandler.bind(null, 'put'),
		delete: addRouteHandler.bind(null, 'delete'),
		patch: addRouteHandler.bind(null, 'patch'),
		head: addRouteHandler.bind(null, 'head'),

		use: addMiddleWare,
		useError: addErrorMiddleWare
	}
}
