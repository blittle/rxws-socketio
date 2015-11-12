export class Response {
	constructor(request, socket) {
		this.headers = request.headers;
		this.body = null;
		this.statusCode = 200;
	}

	setHeader(name, value) {
		this.headers[name] = value;
	}

	getHeader(name) {
		return this.headers[name];
	}

	removeHeader(name) {
		delete this.headers[name];
	}

	send(data) {
	}

	status(code) {
		this.statusCode = code;
	}
}
