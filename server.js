const express = require('express');
const http = require('http'); // Use http instead of https
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();

// HTTP sunucusunu oluştur
const server = http.createServer(app);

// Socket.IO'yu HTTP sunucusuna bağla
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ana overlay sayfasını sun
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.IO bağlantılarını yönet
io.on('connection', (socket) => {
  console.log('Client connected to Socket.IO:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('locationUpdate', (data) => {
    console.log('Location data received from client:', data);
  });
  
});

// HTTP sunucusunu başlat
server.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP Server is running on port ${PORT}`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log('Electron app will handle the tunnel connection');
});

// Düzgün kapatma
process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  server.close(() => {
    console.log('Server has been shut down');
    process.exit(0);
  });
});
