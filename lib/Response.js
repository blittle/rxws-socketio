import { MESSAGE_TYPE } from './constants';

export class Response {
	constructor(request, socket) {
		this.socket = socket;
		this.headers = request.headers;
		this.body = null;
		this.statusCode = 200;
		this.sent = false;
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
		if (!this.sent) {
			this.sent = true;
			this.socket.emit(MESSAGE_TYPE, this.__makePacket(data))
		}
	}

	status(code) {
		this.statusCode = code;
	}

	__makePacket(data) {
		this.headers.statusCode = this.statusCode;
		let resources = this.headers.resource.split('.');

		return {
			body: {
				[resources[resources.length - 1]]: data || this.body
			},
			header: this.headers
		}
	}
}
