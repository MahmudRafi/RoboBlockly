const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let robots = {}; // Tracks online robots

io.on('connection', (socket) => {
    // 1. Robot identification
    socket.on('register-robot', (name) => {
        socket.role = 'robot';
        socket.robotName = name;
        robots[name] = socket.id;
        console.log(`Robot connected: ${name}`);
        io.emit('robot-list', Object.keys(robots)); // Update all web clients
    });

    // 2. Web client identification
    socket.on('get-robots', () => {
        socket.emit('robot-list', Object.keys(robots));
    });

    // 3. Command Relay (Web -> Server -> Robot)
    socket.on('send-command', ({ robotName, command }) => {
        const targetSocketId = robots[robotName];
        if (targetSocketId) {
            io.to(targetSocketId).emit('command', command);
        }
    });

    socket.on('disconnect', () => {
        if (socket.role === 'robot') {
            delete robots[socket.robotName];
            io.emit('robot-list', Object.keys(robots));
            console.log(`Robot disconnected: ${socket.robotName}`);
        }
    });
});

server.listen(3001, () => console.log('Relay Server running on port 3001'));
