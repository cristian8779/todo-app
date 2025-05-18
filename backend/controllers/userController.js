const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Cambiado a bcryptjs
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Faltan datos: username, email y password son obligatorios." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya está registrado con ese correo electrónico." });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // bcryptjs también soporta esto

    const newUser = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      token,
    });
  } catch (err) {
    console.error("Error al registrar el usuario:", err);
    return res.status(500).json({ error: "Hubo un error al registrar el usuario, por favor intente más tarde." });
  }
};

// Login de usuario
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos: email y password son obligatorios." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' }
    );

    return res.json({ token });
  } catch (err) {
    console.error("Error en el login:", err);
    return res.status(500).json({ error: "Hubo un error al iniciar sesión, por favor intente más tarde." });
  }
};
