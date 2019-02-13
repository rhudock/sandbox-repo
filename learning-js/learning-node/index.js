'use strict'

const HelloWorld = require('./es6-class/helloworld');

let c = new HelloWorld(process.argv.slice(2));
c.run();