var io = require('socket.io')();
var rxws = require('../index');

function rxHandler(rxSocket) {
	rxSocket.get('questions')
		.subscribe((options) => {
			var req = options.req;
			var res = options.res;
			var next = options.next;

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
	rxHandler(rxws(socket));
});

io.listen(3000);
