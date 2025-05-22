import axios from 'axios';

// URL base del backend apuntando a /api/users
const API = 'http://20.251.145.196:5100/api/users';

// Función para registrar al usuario
export const register = async (user) => {
  try {
    const response = await axios.post(`${API}/register`, user);
    return response.data;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
};

// Función para hacer login
export const login = async (user) => {
  try {
    const response = await axios.post(`${API}/login`, user);
    return response.data;
  } catch (error) {
    console.error('Error en el login:', error);
    throw error;
  }
};
