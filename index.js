'use strict';

let command = process.argv[2];
let build   = require('./build/');
let http    = require('http');
let fs      = require('fs');

//build
if (command === 'build') {
    build();
    return;
}

//watch file change and build
if (command === 'write') {
    fs.watch('./', function(){
        console.log('file changed, start building');
        build();
    });
    return;
}

//start server to receive github post-commit hook
let server = http.createServer(function(request, response) {
    if (/^\/build/.test(request.url)) {
        build();
        response.end('ok');
    } else {
        response.end('error');
    }
});
server.listen(1111, '127.0.0.1');

