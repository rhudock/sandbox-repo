var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('ts.log')
});

lineReader.on('line', function (line) {
    console.log('Line from file:', line);
    let ptn = /^([^:]*):([0-9- ,:]*) ((?:DEBUG|INFO|WARN|ERROR)) \[([^ ]*)\] - \<(.*)\>/;
    if(ptn.test(line)) {
        let logDetail = ptn.exec(line);
        console.log('Line from file:', logDetail);
    }
});