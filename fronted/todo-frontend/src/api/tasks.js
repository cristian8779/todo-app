import axios from 'axios';
const API = 'http://localhost:5000/api';

// Verifica que el token esté presente
export const getTasks = (token) => {
  console.log('Token getTasks:', token); // Verificación del token
  return axios.get(`${API}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(response => {
    console.log('Tareas obtenidas:', response.data);  // Verifica la respuesta de las tareas
    return response;
  })
  .catch(error => {
    console.error("Error al obtener tareas:", error.response || error); // Captura el error de la API
    throw error;
  });
};

export const createTask = (task, token) => {
  console.log('Token createTask:', token); // Verificación del token
  console.log('Task to create:', task); // Verificación de la tarea que se va a crear
  return axios.post(`${API}/tasks`, task, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(response => {
    console.log('Tarea creada:', response.data);  // Verifica la respuesta de la tarea creada
    return response;
  })
  .catch(error => {
    console.error("Error al crear tarea:", error.response || error); // Captura el error de la API
    throw error;
  });
};

export const updateTask = (id, updates, token) => {
  console.log('Token updateTask:', token); // Verificación del token
  console.log('Updated Task:', updates); // Verificación de los cambios en la tarea
  return axios.put(`${API}/tasks/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(response => {
    console.log('Tarea actualizada:', response.data);  // Verifica la respuesta de la tarea actualizada
    return response;
  })
  .catch(error => {
    console.error("Error al actualizar tarea:", error.response || error); // Captura el error de la API
    throw error;
  });
};

export const deleteTask = (id, token) => {
  console.log('Token deleteTask:', token); // Verificación del token
  return axios.delete(`${API}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(response => {
    console.log('Tarea eliminada:', response.data);  // Verifica la respuesta de la tarea eliminada
    return response;
  })
  .catch(error => {
    console.error("Error al eliminar tarea:", error.response || error); // Captura el error de la API
    throw error;
  });
};
