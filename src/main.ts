/// <reference path="../typings/index.d.ts" />

import * as socketIo from 'socket.io';
import * as fs from 'fs';
import * as http from 'http';
import Room from './room';

const port = process.env.VCAP_APP_PORT || 3000;

const server = http.createServer((req: any, res: any)=>{
    res.writeHead(200, { 'Content-Type' : 'text/html' });
    res.end( fs.readFileSync('www/index.html', 'utf-8') );
}).listen(port);

const io = socketIo.listen(server);

const hash: {[key: string]: string} = {};

io.sockets.on('connection', (socket: SocketIO.Socket)=>{
    socket.on('echo', (data: any)=>{
        socket.emit('echo', {value: data});
    });

    socket.on('login', (data: any)=>{
        if(!("key" in data) || !("peerId" in data) || key in hash) {
            socket.disconnect();
        }

        hash[peerId] = socket.id;
        socket.peerId = peerId;
    });

    socket.on('disconnect', (reason: string)=>{
        delete hash[socket.peerId];
        //console.log("disconnect", socket.id, socket.peerId);
    })
});
