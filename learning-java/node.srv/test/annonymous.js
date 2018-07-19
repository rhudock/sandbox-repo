function() {
	console.warn("Rule 1380 is Good");
	window.setTimeout(function () {
		console.warn("FlashPeer.popOutChat is called.");
		top.inqFrame.Inq.FlashPeer.popOutChat(true, true);
	}, 1000);
}
