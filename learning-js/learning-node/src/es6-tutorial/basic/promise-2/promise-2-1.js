var prom = function square(x) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(Math.pow(x, 2));
		}, 2000);
	});
}(10);

prom.then(data => {
	console.log(data);
});