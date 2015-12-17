import io from 'socket.io-client';
import { Observable } from 'rx';

const MESSAGE_TYPE = '__rxwsData';

let socket;

export default {
	connect(url) {
		return Observable.create((observer) => {
			socket = io(url);
			socket.on('connect', function() {
				observer.onNext()
			});

			socket.on('disconnect', function() {
				observer.onError('Lost connection');
			});

			socket.on('error', function() {
				observer.onError('Error');
			});
		});
	},

	write(request) {
		socket.emit(MESSAGE_TYPE, request)
	},

	onMessage(callback) {
		socket.on(MESSAGE_TYPE, callback);
	},

	close() {
		socket.close();
	}
}
