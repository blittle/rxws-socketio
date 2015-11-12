const MESSAGE_TYPE = '__rxwsData';

export default function(ioSocket) {
	ioSocket.on('connection', (socket) => {
		socket.on(MESSAGE_TYPE, (data) => {
		});

		socket.on('disconnect', () => {
			console.log('DISCONNECTED');
			console.log(arguments);
		});
	});

	return {
		get: () => {},
		post: () => {},
		put: () => {},
		delete: () => {},
		patch: () => {},
		head: () => {}
	}
}
