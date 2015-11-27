import expect from 'expect.js';
import { handleRequest, makeRequest } from '../lib/Request';

describe('Request', () => {
	describe('makeRequest', () => {
		it('should produce a request object', () => {
			const request = makeRequest({
				header: {
					resource: 'get.students.grades',
					parameters: 1,
					queryParameters: 2
				},
				body: 3
			});

			expect(request.resource).to.be('students.grades');
			expect(request.method).to.be('get');
			expect(request.body).to.be(3);
			expect(request.parameters).to.be(1);
			expect(request.query).to.be(2);
    });

		it('should calculate resource and method', () => {
			const requestPut = makeRequest({
				header: {
					resource: 'put.students.grades'
				}
			});
			expect(requestPut.resource).to.be('students.grades');
			expect(requestPut.method).to.be('put');

			const requestDelete = makeRequest({
				header: {
					resource: 'delete.students.grades'
				}
			});
			expect(requestDelete.resource).to.be('students.grades');
			expect(requestDelete.method).to.be('delete');

			const requestLong = makeRequest({
				header: {
					resource: 'post.students.grades.other.stuff'
				}
			});
			expect(requestLong.resource).to.be('students.grades.other.stuff');
			expect(requestLong.method).to.be('post');
		});
  });
});
