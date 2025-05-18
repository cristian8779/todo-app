const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // Cambiado de 'password' a 'passwordHash'
});

const User = mongoose.model('User', userSchema);

module.exports = User;
