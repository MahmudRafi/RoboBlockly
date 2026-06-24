const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Enable CORS so your Vercel website can connect to this Render server
const io = new Server(server, {
    cors: {
        origin: "*", // Allows any website (Vercel) to connect
        methods: ["GET", "POST"]
    }
});

// This object will store all currently connected robots
// Format: { "Robot-1": "socket_id_abc", "Robot-2": "socket_id_xyz" }
let onlineRobots = {};

io.on('connection', (socket) => {
    console.log('New connection established:', socket.id);

    // --- ROBOT HANDLERS ---

    // 1. When an ESP8266 connects, it sends its name
    socket.on('register-robot', (robotName) => {
        socket.role = 'robot';
        socket.robotName = robotName;
        onlineRobots[robotName] = socket.id;
        
        console.log(`🤖 Robot Registered: ${robotName}`);
        
        // Tell all web dashboards that the robot list has changed
        io.emit('robot-list', Object.keys(onlineRobots));
    });

    // --- DASHBOARD (VERCEL) HANDLERS ---

    // 2. When the website opens, it asks for the list of online robots
    socket.on('get-robots', () => {
        socket.emit('robot-list', Object.keys(onlineRobots));
    });

    // 3. When you click a block in Blockly, it sends a command here
    // Expected data: { robotName: "Robot-1", command: "f" }
    socket.on('send-command', (data) => {
        const { robotName, command } = data;
        const targetSocketId = onlineRobots[robotName];

        if (targetSocketId) {
            console.log(`📤 Relaying command [${command}] to ${robotName}`);
            // Send the command directly to that specific robot
            io.to(targetSocketId).emit('command', command);
        } else {
            console.log(`⚠️ Robot ${robotName} not found or offline.`);
        }
    });

    // --- DISCONNECT HANDLER ---

    socket.on('disconnect', () => {
        if (socket.role === 'robot') {
            console.log(`❌ Robot Offline: ${socket.robotName}`);
            delete onlineRobots[socket.robotName];
            
            // Update the website list so the robot disappears from the dropdown
            io.emit('robot-list', Object.keys(onlineRobots));
        }
    });
});

// Render provides the PORT automatically via process.env.PORT
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`🚀 RoboBlockly Relay Server running on port ${PORT}`);
});const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Enable CORS so your Vercel website can connect to this Render server
const io = new Server(server, {
    cors: {
        origin: "*", // Allows any website (Vercel) to connect
        methods: ["GET", "POST"]
    }
});

// This object will store all currently connected robots
// Format: { "Robot-1": "socket_id_abc", "Robot-2": "socket_id_xyz" }
let onlineRobots = {};

io.on('connection', (socket) => {
    console.log('New connection established:', socket.id);

    // --- ROBOT HANDLERS ---

    // 1. When an ESP8266 connects, it sends its name
    socket.on('register-robot', (robotName) => {
        socket.role = 'robot';
        socket.robotName = robotName;
        onlineRobots[robotName] = socket.id;
        
        console.log(`🤖 Robot Registered: ${robotName}`);
        
        // Tell all web dashboards that the robot list has changed
        io.emit('robot-list', Object.keys(onlineRobots));
    });

    // --- DASHBOARD (VERCEL) HANDLERS ---

    // 2. When the website opens, it asks for the list of online robots
    socket.on('get-robots', () => {
        socket.emit('robot-list', Object.keys(onlineRobots));
    });

    // 3. When you click a block in Blockly, it sends a command here
    // Expected data: { robotName: "Robot-1", command: "f" }
    socket.on('send-command', (data) => {
        const { robotName, command } = data;
        const targetSocketId = onlineRobots[robotName];

        if (targetSocketId) {
            console.log(`📤 Relaying command [${command}] to ${robotName}`);
            // Send the command directly to that specific robot
            io.to(targetSocketId).emit('command', command);
        } else {
            console.log(`⚠️ Robot ${robotName} not found or offline.`);
        }
    });

    // --- DISCONNECT HANDLER ---

    socket.on('disconnect', () => {
        if (socket.role === 'robot') {
            console.log(`❌ Robot Offline: ${socket.robotName}`);
            delete onlineRobots[socket.robotName];
            
            // Update the website list so the robot disappears from the dropdown
            io.emit('robot-list', Object.keys(onlineRobots));
        }
    });
});

// Render provides the PORT automatically via process.env.PORT
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`🚀 RoboBlockly Relay Server running on port ${PORT}`);
});
