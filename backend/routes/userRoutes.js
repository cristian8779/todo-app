const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/userController');

// Rutas de autenticación
router.post('/register', registerUser); // POST /api/users/register
router.post('/login', loginUser);       // POST /api/users/login

module.exports = router;
