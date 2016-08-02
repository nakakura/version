/// <reference path="../typings/index.d.ts" />

import * as socketIo from 'socket.io';
import * as fs from 'fs';
import * as http from 'http';
import * as _ from 'lodash';

const port = process.env.VCAP_APP_PORT || 3000;

const exec = require('child_process').exec;
var stdout = "";

exec('node -v', (err, out, stderr) => {
    if (err) { console.log(err); }
    stdout += out;
    stdout += "\n";
    console.log(stdout);
});

const server = http.createServer((req: any, res: any)=>{
    res.writeHead(200, { 'Content-Type' : 'text/html' });
    res.end( fs.readFileSync('www/index.html', 'utf-8') );
}).listen(port);

const io = socketIo.listen(server);

const hash: {[key: string]: SocketIO.Socket} = {};

io.sockets.on('connection', (socket: SocketIO.Socket)=>{
    socket.on('list', (data: any)=>{
        const array = Object.keys(hash);
        socket.emit("list", array);
    });

    socket.on('login', (data: any)=>{
        if(!("key" in data) || !("peerId" in data) || data.peerId in hash) {
            socket.disconnect();
        }

        hash[data.peerId] = socket;
        socket.peerId = data.peerId;
        socket.emit("login", stdout);
    });

    socket.on("message", (peerId: string, message: any)=>{
        if(!(peerId in hash)) return;
        hash[peerId].emit("message", message);
    });

    socket.on('disconnect', (reason: string)=>{
        if(!('peerId' in socket)) return;
        delete hash[socket.peerId];
        console.log("disconnect", socket.id, socket.peerId);
    })
});
