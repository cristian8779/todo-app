// src/api/auth.js
import axios from 'axios';

// Usamos la variable de entorno para la URL base del backend
const API = process.env.REACT_APP_API;

// Función para registrar al usuario
export const register = async (user) => {
  try {
    const response = await axios.post(`${API}/register`, user);
    return response.data;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error; // Lanza el error para que pueda ser capturado en el componente
  }
};

// Función para hacer login
export const login = async (user) => {
  try {
    const response = await axios.post(`${API}/login`, user);
    return response.data; // Asegúrate de que la respuesta tenga un token
  } catch (error) {
    console.error('Error en el login:', error);
    throw error; // Lanza el error para que pueda ser capturado en el componente
  }
};