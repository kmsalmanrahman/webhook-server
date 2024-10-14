require('dotenv').config();
const app = require('./app');
const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

// Initialize WebSocket server
const io = socketIo(server);

// Watch the JSON file for changes
const jsonFilePath = path.join(__dirname, 'data', 'webhookResponses.json');
fs.watch(jsonFilePath, (eventType, filename) => {
  if (eventType === 'change') {
    console.log('JSON file updated');
    io.emit('fileUpdated');
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
