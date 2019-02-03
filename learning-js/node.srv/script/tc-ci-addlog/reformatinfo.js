// Use https://regex101.com/

module.exports = {
    debugInfo: [
        {
            name: "separate declaration",
            keyToSearch: /([ ]*)var(.*)/gi,
            replaceWith: function (match, g1, g2) {
				console.log('match:' + match);
				console.log('g1:' + g1);
				console.log('g2:' + g2);
				var result = match.replace(/,/gi, ";\n" + g1 + "var ");
				console.log('result:' + result);
                return result;
            },
            enabled: true
        }
    ]
};
