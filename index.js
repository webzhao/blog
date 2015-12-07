'use strict';

let command = process.argv[2];
let build   = require('./build/');
let http    = require('http');
let fs      = require('fs');
let crypto  = require('crypto');
var exec    = require('child_process').exec;
var config  = require('./config.js');

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
    if (request.method != 'POST') {
        response.statusCode = 405;
        response.statusMessage = 'Method not allowed';
        response.end('405 Method not allowed');
        return;
    }
    let body = '';
    request.on('data', function(chunk) {
        body += chunk.toString();
    });
    request.on('end', function() {
        let secret_token = config.github_hook_key
        let hmac = crypto.createHmac('sha1', secret_token);
        hmac.update(body);
        if (('sha1=' + hmac.digest('hex')) != request.headers['x-hub-signature']) {
            response.end('fake request');
            return;
        }
        process.nextTick(function() {
            exec('git pull', function(error, stdout, stderr) {
                if (error) {
                    console.error(stderr);
                    return;
                }
                console.log(stdout);
                build();
            });
        });
        response.end('ok');
    });
});
server.listen(config.github_hook_port);

