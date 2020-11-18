const http = require('http');

const server = http.createServer((req, res) => {
	// This function is called once the headers have been received
	res.setHeader('Content-Type', 'application/json');

	if (req.method !== 'POST' || req.url !== '/user') {
		res.statusCode = 405;
		res.end('{"error":"METHOD_NOT_ALLOWED"}');
		return;
	}

	let body = '';

	req.on('data', (data) => {
		// This function is called as chunks of body are received
		body += data;
	});

	req.on('end', () => {
		// This function is called once the body has been fully received
		let parsed;

		try {
			parsed = JSON.parse(body);
		} catch (e) {
			res.statusCode = 400;
			res.end('{"error":"CANNOT_PARSE"}');
		}

		res.end(JSON.stringify({
			error: false,
			username: parsed.username
		}));
	});
});

server.listen(3000, () => {
	console.log('Server running at http://localhost:3000/');
});