import rxws from '../src/index';
import expect from 'expect.js';

let callback;
let sentMessages = [];

let socket = {
	on(type, cb) {
		if (type === 'connection') {
			cb({
				on: (type, _callback) => {
					callback = _callback;
				},

				emit(type, data) {
					sentMessages.push({ type, data });
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
		afterEach(() => {
			sentMessages = [];
		});

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

			setTimeout(() => {
				expect(sentMessages.length).to.be(1);
				expect(sentMessages[0].data.header.statusCode).to.be(500);
				expect(sentMessages[0].data.body.questions.error).to.be('Resource not found');
				sentMessages = [];
				done();
			}, 10);
		});

		it('should route to error handlers when an error is passed to next', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					next('This is an error');
				});

			rxSocket.useError()
				.subscribe(({err, req, res, next}) => {
					expect(err).to.be('This is an error');
					done();
				});

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

		it('should skip non error handlers once an error is thrown', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					next('This is an error');
				});

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					throw new Error('Should not reach this handler');
				});

			rxSocket.useError()
				.subscribe(({err, req, res, next}) => {
					expect(err).to.be('This is an error');
					done();
				});

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

		it('should route through multiple error handlers', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					next('This is an error');
				});

			rxSocket.useError()
				.subscribe(({err, req, res, next}) => {
					expect(err).to.be('This is an error');
					next('new error');
				});

			rxSocket.useError()
				.subscribe(({err, req, res, next}) => {
					expect(err).to.be('new error');
					done();
				});

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
	});

	describe('Response handling', () => {
		afterEach(() => {
			sentMessages = [];
		});

		it('should send response for get request', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					res.send({someData: 'test'})

					setTimeout(() => {
						expect(sentMessages.length).to.be(1);
						expect(sentMessages[0].data.header.statusCode).to.be(200);
						expect(sentMessages[0].data.body.questions.someData).to.be('test');
						sentMessages = [];
						done();
					});
				});

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

		it('should skip handlers that do not correspond to resource', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.get('things')
				.subscribe(({req, res, next}) => {
					throw(new Error("Should not execute this handler"));
				});

			rxSocket.get('stuffs')
				.subscribe(({req, res, next}) => {
					throw(new Error("Should not execute this handler"));
				});

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					done();
				});

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

		it('should route to multiple matching handlers', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					res.status(205);
					next();
				});

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					expect(res.statusCode).to.be(205);
					res.send({someData: 'test'})

					setTimeout(() => {
						expect(sentMessages.length).to.be(1);
						expect(sentMessages[0].data.header.statusCode).to.be(205);
						expect(sentMessages[0].data.body.questions.someData).to.be('test');
						sentMessages = [];
						done();
					});
				});

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

		it('should pass modified request to multiple handlers', (done) => {
			let rxSocket = rxws(socket);

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					req.headers.apiVersion = '2.0.0';
					next();
				});

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					expect(req.headers.apiVersion).to.be('2.0.0');
					done();
				});

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

		it('should route through generic middleware in the correct order', (done) => {
			let rxSocket = rxws(socket);
			let index = 0;

			rxSocket.use()
				.subscribe(({req, res, next}) => {
					expect(index).to.be(0);
					index++;
					next();
				});

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					expect(index).to.be(1);
					index++;
					next();
				});

			rxSocket.use()
				.subscribe(({req, res, next}) => {
					expect(index).to.be(2);
					index++;
					next();
				});

			rxSocket.get('questions')
				.subscribe(({req, res, next}) => {
					expect(index).to.be(3);
					index++;
					done();
				});

			rxSocket.use()
				.subscribe(({req, res, next}) => {
					expect(index).to.be(4);
					done();
				});

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
	})
});
