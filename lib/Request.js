export function handleRequest(index, handlers, socket, req, res) {
	if (!handlers[index]) return sendError(socket, "404 Request not handled");

	const name = handlers[index].name;

	if (name === 'use' || name === (req.method + '.' + req.resource)) {
		handlers[index].observer.onNext({req, res, next: (error) => {
			handleRequest(index + 1, handlers, socket, req, res)
		}})
	} else {
		handleRequest(index + 1, handlers, socket, req, res);
	}
}

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
