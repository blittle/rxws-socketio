var rxws = require('rxws');

var SocketIOBackend = require('../lib/SocketIOBackend');

rxws.setBackend({
	backend: SocketIOBackend.default,
	url: 'http://localhost:3000'
});

setInterval(function() {
	rxws.get('questions')
		.subscribe(function(resp) {
			console.log(resp.questions);
		});
}, 1000);
