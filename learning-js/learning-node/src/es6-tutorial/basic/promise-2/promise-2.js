function square(x) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(Math.pow(x, 2));
		}, 2000);
	});
}

square(10).then(data => {
	console.log(data);
});