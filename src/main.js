/// <reference path="../typings/index.d.ts" />
"use strict";
var socketIo = require('socket.io');
var fs = require('fs');
var http = require('http');
var port = process.env.VCAP_APP_PORT || 3000;
var exec = require('child_process').exec;
var stdout = "";
exec('node -v', function (err, out, stderr) {
    if (err) {
        console.log(err);
    }
    stdout += out;
    stdout += "\n";
    console.log(stdout);
});
var server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync('www/index.html', 'utf-8'));
}).listen(port);
var io = socketIo.listen(server);
var hash = {};
io.sockets.on('connection', function (socket) {
    socket.on('list', function (data) {
        var array = Object.keys(hash);
        socket.emit("list", array);
    });
    socket.on('login', function (data) {
        if (!("key" in data) || !("peerId" in data) || data.peerId in hash) {
            socket.disconnect();
        }
        hash[data.peerId] = socket;
        socket.peerId = data.peerId;
        socket.emit("login", process.env);
        socket.emit("login", stdout);
    });
    socket.on("message", function (peerId, message) {
        if (!(peerId in hash))
            return;
        hash[peerId].emit("message", message);
    });
    socket.on('disconnect', function (reason) {
        if (!('peerId' in socket))
            return;
        delete hash[socket.peerId];
        console.log("disconnect", socket.id, socket.peerId);
    });
});
