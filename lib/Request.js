/**
 * Pass the request through a list of handlers until it is properly
 * handled.
 */
export function handleRequest(index, handlers, errorHandlers, req, res) {
	if (req.sent) return null;
	if (!handlers[index]) return handleError("404 resource not found", 0, errorHandlers, req, res);

	const name = handlers[index].name;

	if (name === 'use' || name === (req.method + '.' + req.resource)) {
		handlers[index].observer.onNext({req, res, next: (error) => {
			handleRequest(index + 1, handlers, errorHandlers, req, res)
		}})
	} else {
		handleRequest(index + 1, handlers, errorHandlers, req, res);
	}
}

export function handleError(error, index, errorHandlers, req, res) {
	if (req.sent) return null;
	const handler = errorHandlers[index];

	if (!handler) throw new Error('FATAL Error: Error handlers cannot be undefined');

	errorHandlers[index].observer.onNext({error, req, res, next: (error) => {
		handleError(error, index + 1, handlers, errorHandlers, req, res)
	}});
}

/**
 * Transform a raw request json packet from socketio into a request
 * object to pass to the route handlers.
 *
 * @param {object} data a json data packet from the websocket
 * @return {object} request object
 */
export function makeRequest(data) {
	let resList = data.header.resource.split('.');
	const method = resList[0];
	resList.splice(0, 1);

	const resource = resList.join('.');

	return {
		headers: data.header,
		parameters: data.header.parameters,
		query: data.header.queryParameters,
		body: data.body,
		resource, method
	}
}
