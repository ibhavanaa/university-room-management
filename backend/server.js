require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');

connectDB();

const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const eventBus = require('./src/utils/eventBus');
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN || '*', credentials: true }
});

io.on('connection', (socket) => {
  // Clients can join rooms by role or user if needed
});

// Bridge app events to websocket broadcasts
eventBus.on('booking:update', (payload) => {
  io.emit('booking:update', payload);
});
eventBus.on('room:update', (payload) => {
  io.emit('room:update', payload);
});
eventBus.on('timetable:update', (payload) => {
  io.emit('timetable:update', payload);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
