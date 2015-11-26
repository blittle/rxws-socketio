import expect from 'expect.js';

import { MESSAGE_TYPE } from './constants';
import { Response } from './Response';

describe('Response', () => {
	it('should create a response', () => {
		let res = new Response({headers: 1}, 2);

		expect(res.headers).to.be(1);
		expect(res.socket).to.be(2);
		expect(res.body).to.be(null);
		expect(res.statusCode).to.be(200);
		expect(res.sent).to.be(false);
	});

	it('should set headers', () => {
		let res = new Response({headers: {}}, 2);
		res.setHeader('test', 555);
		expect(res.headers.test).to.be(555);
	});

	it('should get headers', () => {
		let res = new Response({headers: {}}, 2);
		res.setHeader('test', 555);
		expect(res.getHeader('test')).to.be(555);
	});

	it('should delete headers', () => {
		let res = new Response({headers: {}}, 2);
		res.setHeader('test', 555);
		res.removeHeader('test');
		expect(res.headers.test).to.be(undefined);
	});

	it('should set status code', () => {
		let res = new Response({headers: {}}, 2);
		res.status(500);
		expect(res.statusCode).to.be(500);
	});

	it('should send a message with correct packet structure', (done) => {
		let res = new Response({headers: {correlationId: 5, resource: 'get.books.pages'}}, {
			emit(type, data) {
				expect(type).to.be(MESSAGE_TYPE);
				expect(data.body.pages.someData).to.be(1);
				done();
			}
		});

		res.status(500);
		res.send({
			someData: 1
		});
	});

	it('should mark the response as sent', (done) => {
		let res = new Response({headers: {correlationId: 5, resource: 'get.books.pages'}}, {
			emit(type, data) {
				expect(res.sent).to.be(true);
				done();
			}
		});

		res.status(500);
		res.send({
			someData: 1
		});
	});


	it('should only send once', (done) => {
		let count = 0;

		let res = new Response({headers: {correlationId: 5, resource: 'get.books.pages'}}, {
			emit(type, data) {
				count++;
			}
		});

		res.status(500);

		res.send({
			someData: 1
		});

		res.send({
			someData: 2
		});

		res.send({
			someData: 3
		});

		setTimeout(() => {
			expect(count).to.be(1);
			done();
		}, 50);
	});
});
