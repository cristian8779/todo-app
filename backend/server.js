const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app); // ⬅️ Usamos http para trabajar con socket.io

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {

})
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Manejo de eventos de reconexión de MongoDB
mongoose.connection.on('disconnected', () => {
  console.log('🔴 MongoDB desconectado');
});
mongoose.connection.on('reconnected', () => {
  console.log('🟢 MongoDB reconectado');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ Error en la conexión de MongoDB:', err);
});

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Ajusta si tu frontend está en otro dominio
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Guarda la instancia de io para usarla en rutas/controladores
app.set('io', io);

// Manejo de conexiones de clientes
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
});

// Rutas
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Iniciar servidor con WebSocket
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
