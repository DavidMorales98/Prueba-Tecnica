require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const { initChatSocket } = require('./socket/chatSocket');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Rutas REST
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io
initChatSocket(io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`\nServidor corriendo en http://localhost:${PORT}`);
  console.log(`Socket.io disponible en ws://localhost:${PORT}/chat`);
  console.log(`\nAcceso: RUT 19881480 / contrasena 123456\n`);
});
