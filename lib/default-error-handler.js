import { Observable } from 'rx';

export default function getDefaultErrorHandler(callback) {
	Observable.create((_observer) => {
		callback({ observer });
	}).subscribe(({err, req, res, next}) => {
		res.status(500);
		res.send('error', { error: err });
	});
}
