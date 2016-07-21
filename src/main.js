/// <reference path="../typings/index.d.ts" />
var socketIo = require('socket.io');
var fs = require('fs');
var http = require('http');
var port = process.env.VCAP_APP_PORT || 3000;
var server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync('www/index.html', 'utf-8'));
}).listen(port);
var io = socketIo.listen(server);
var hash = {};
io.sockets.on('connection', function (socket) {
    socket.on('echo', function (data) {
        socket.emit('echo', { value: data });
    });
    socket.on('login', function (data) {
        if (!("key" in data) || !("peerId" in data) || key in hash) {
            socket.disconnect();
        }
        hash[peerId] = socket.id;
        socket.peerId = peerId;
    });
    socket.on('disconnect', function (reason) {
        delete hash[socket.peerId];
        //console.log("disconnect", socket.id, socket.peerId);
    });
});
//# sourceMappingURL=main.js.map