const express = require('express');
const auth = require('../middlewares/auth');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const router = express.Router();

// Usar middleware de autenticación
router.use(auth);  // Aquí debería funcionar correctamente si el middleware 'auth' está bien configurado

// Rutas para CRUD de tareas
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
