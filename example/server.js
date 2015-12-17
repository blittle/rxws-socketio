var io = require('socket.io')(3000);
var rxws = require('../lib/index').default;

function rxHandler(rxSocket) {
	rxSocket.get('questions')
		.subscribe((options) => {
			var req = options.req;
			var res = options.res;
			var next = options.next;
			console.log('message');

			res.send([
				{
					id: 1,
					name: 'userName',
					label: 'What is your name?'
				}
			])
		});
}

io.on('connection', function(socket) {
	console.log('connection');
	rxHandler(rxws(socket));
});

// io.listen(3000);
