const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Verificación de configuración crítica
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET no está definido en el archivo .env');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI no está definido en el archivo .env');
  process.exit(1);
}

// Middleware global
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

mongoose.connection.on('disconnected', () => {
  console.log('🔴 MongoDB desconectado');
});
mongoose.connection.on('reconnected', () => {
  console.log('🟢 MongoDB reconectado');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ Error en la conexión de MongoDB:', err);
});

// Configuración de Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // En producción: reemplaza con el dominio de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware de autenticación para Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log('🛡️ Token recibido:', token);

  if (!token) {
    console.warn('⛔ Cliente intentó conectar sin token');
    return next(new Error("No token provided"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = payload;
    console.log('✅ Token válido para usuario:', payload.id || payload);
    next();
  } catch (error) {
    console.warn('⛔ Token inválido:', error.message);
    return next(new Error("Token inválido"));
  }
});

// Guardamos io en app para usarlo en controladores
app.set('io', io);

// Manejo de conexiones socket
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id, '| Usuario:', socket.user?.id || 'desconocido');

  socket.on('disconnect', (reason) => {
    console.log(`🔴 Cliente desconectado: ${socket.id} (motivo: ${reason})`);
  });

  socket.on('error', (err) => {
    console.error('❌ Error en socket:', err);
  });
});

// Ruta de prueba
app.get('/api', (req, res) => {
  res.send('👋 Bienvenido a la API de tu app');
});

// Rutas
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5100;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
