import axios from 'axios';

const API = 'http://20.251.145.196:5100/api'; // Cambia esta URL si tu backend usa otra ruta base

export const getTasks = (token) => {
  return axios.get(`${API}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const createTask = (task, token) => {
  return axios.post(`${API}/tasks`, task, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateTask = (id, updates, token) => {
  return axios.put(`${API}/tasks/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteTask = (id, token) => {
  return axios.delete(`${API}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

