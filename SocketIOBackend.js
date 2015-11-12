import io from 'socket.io';
import { Observable } from 'rx';

const MESSAGE_TYPE = '__rxwsData';

let socket;

export default {
	connect(url) {
		socket = io(url);
		return Observable.create((observer) => {
			socket.on('connect', observer.onNext);
			socket.on('disconnect', observer.onError.bind(null, 'Lost connection'));
			socket.on('error', observer.onError.bind(null, 'Error'));
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
