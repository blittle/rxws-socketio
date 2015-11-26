import rxws from '../index';
import expect from 'expect.js';

let callback;

let socket = {
	on(type, cb) {
		if (type === 'connection') {
			cb({
				on: (type, _callback) => {
					callback = _callback;
				}
			})
		}
	}
};

function sendMockRequest(data) {
	callback(data);
}

describe('RXWS', () => {
	describe('Route handling', () => {
		it('should route get requests', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					done();
				})

				sendMockRequest({
					"header": {
						"resource": "get.questions",
						"parameters": {"questions": 333},
						"apiVersion": "1.2.1", //major, minor, patch
						"correlationId": "FUFJ-XHJHF-FFFF-RRRR"
					},
					"body": null
				});
		});

		it('should route post requests', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.post('questions')
				.subscribe(({req, res, next}) => {
					done();
				})

				sendMockRequest({
					"header": {
						"resource": "post.questions",
						"parameters": {"questions": 333},
						"apiVersion": "1.2.1", //major, minor, patch
						"correlationId": "FUFJ-XHJHF-FFFF-RRRR"
					},
					"body": null
				});
		});

		it('should route put requests', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.put('questions')
				.subscribe(({req, res, next}) => {
					done();
				})

				sendMockRequest({
					"header": {
						"resource": "put.questions",
						"parameters": {"questions": 333},
						"apiVersion": "1.2.1", //major, minor, patch
						"correlationId": "FUFJ-XHJHF-FFFF-RRRR"
					},
					"body": null
				});
		});

		it('should route delete requests', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.delete('questions')
				.subscribe(({req, res, next}) => {
					done();
				})

				sendMockRequest({
					"header": {
						"resource": "delete.questions",
						"parameters": {"questions": 333},
						"apiVersion": "1.2.1", //major, minor, patch
						"correlationId": "FUFJ-XHJHF-FFFF-RRRR"
					},
					"body": null
				});
		});

		it('should route patch requests', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.patch('questions')
				.subscribe(({req, res, next}) => {
					done();
				})

				sendMockRequest({
					"header": {
						"resource": "patch.questions",
						"parameters": {"questions": 333},
						"apiVersion": "1.2.1", //major, minor, patch
						"correlationId": "FUFJ-XHJHF-FFFF-RRRR"
					},
					"body": null
				});
		});

		it('should route head requests', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.head('questions')
				.subscribe(({req, res, next}) => {
					done();
				})

				sendMockRequest({
					"header": {
						"resource": "head.questions",
						"parameters": {"questions": 333},
						"apiVersion": "1.2.1", //major, minor, patch
						"correlationId": "FUFJ-XHJHF-FFFF-RRRR"
					},
					"body": null
				});
		});
	});

	describe('Error handling', () => {
		it('should send error with default error handler', (done) => {
			let rxSocket = rxws(socket);

			sendMockRequest({
				"header": {
					"resource": "head.questions",
					"parameters": {"questions": 333},
					"apiVersion": "1.2.1", //major, minor, patch
					"correlationId": "FUFJ-XHJHF-FFFF-RRRR"
				},
				"body": null
			});
		});
	});
});
