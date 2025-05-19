import React, { useEffect, useState, useCallback } from 'react';  // Importar useCallback
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';

import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { getTasks, deleteTask, updateTask, createTask } from '../api/tasks';

import '../styles/Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Use useCallback para memorizar la función y evitar la advertencia
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTasks(token);
      setTasks(res.data);
    } catch (err) {
      toast.error('Error al cargar las tareas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchTasks();
    }
  }, [token, navigate, fetchTasks]);  // Añadir fetchTasks a las dependencias

  // Conexión Socket.IO
  useEffect(() => {
const newSocket = io('http://192.168.147.91:5000');
    setSocket(newSocket);

    newSocket.on('taskUpdated', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? { ...task, ...updatedTask } : task
        )
      );
    });

    newSocket.on('taskCreated', (newTask) => {
      setTasks((prevTasks) => {
        const alreadyExists = prevTasks.some((t) => t._id === newTask._id);
        return alreadyExists ? prevTasks : [...prevTasks, newTask];
      });
    });

    newSocket.on('taskDeleted', (deletedTaskId) => {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== deletedTaskId)
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const notify = (message, type = 'success') => {
    toast[type](message);
  };

  const handleCreate = async (task) => {
    try {
      const res = await createTask(task, token);
      notify('Tarea creada');

      if (socket) {
        socket.emit('taskCreated', res.data);
      }
    } catch (err) {
      notify('No se pudo crear la tarea', 'error');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id, token);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      notify('Tarea eliminada');

      if (socket) {
        socket.emit('taskDeleted', id);
      }
    } catch (err) {
      notify('No se pudo eliminar la tarea', 'error');
    }
  };

  const handleToggleStatus = async (id) => {
    const task = tasks.find((t) => t._id === id);
    const newStatus = task.status === 'pendiente' ? 'completada' : 'pendiente';

    try {
      await updateTask(id, { status: newStatus }, token);
      setTasks((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, status: newStatus } : t
        )
      );
      notify(`Tarea marcada como "${newStatus}"`, 'info');

      if (socket) {
        socket.emit('taskUpdated', { _id: id, status: newStatus });
      }
    } catch (err) {
      notify('Error al cambiar el estado', 'error');
    }
  };

  const handleUpdate = async (id, updatedFields) => {
    try {
      const res = await updateTask(id, updatedFields, token);
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, ...res.data } : task
        )
      );
      notify('Tarea actualizada');

      if (socket) {
        socket.emit('taskUpdated', res.data);
      }
    } catch (err) {
      notify('No se pudo actualizar la tarea', 'error');
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-top">
        <input
          className="task-search-input"
          type="text"
          placeholder="Buscar tareas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="task-form-wrapper">
          <TaskForm onSubmit={handleCreate} />
        </div>
      </div>

      <main className="dashboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p>Cargando tareas...</p>
          </div>
        ) : search !== '' && filteredTasks.length === 0 ? (
          <div className="empty-tasks-message">
            <i className="fas fa-search empty-icon"></i>
            <p>No hay notas que coincidan con la búsqueda.</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-tasks-message">
            <p>Las notas que agregues aparecerán aquí.</p>
          </div>
        ) : (
          <div className="task-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;
