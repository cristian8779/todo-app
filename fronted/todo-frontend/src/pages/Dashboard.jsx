import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';

import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { getTasks, deleteTask, updateTask, createTask } from '../api/tasks';

import '../styles/Dashboard.css';

const SOCKET_URL = 'http://20.251.145.196:5100';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Traer tareas
  const fetchTasks = useCallback(async () => {
    if (!token) return;
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

  // Verificar token y cargar tareas
  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchTasks();
    }
  }, [token, navigate, fetchTasks]);

  // Conexión socket.io
  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      cors: {
        origin: '*',
      },
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('[socket] conectado:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('[socket] error:', err.message);
    });

    socket.on('taskCreated', (newTask) => {
      setTasks((prev) =>
        prev.some((t) => t._id === newTask._id) ? prev : [...prev, newTask]
      );
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === updatedTask._id ? { ...t, ...updatedTask } : t
        )
      );
    });

    socket.on('taskDeleted', (deletedTaskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== deletedTaskId));
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Notificaciones
  const notify = (message, type = 'success') => {
    toast[type](message);
  };

  // Crear tarea
  const handleCreate = async (task) => {
    if (!token) return;
    try {
      await createTask(task, token);
      notify('Tarea creada');
    } catch (err) {
      notify('No se pudo crear la tarea', 'error');
      console.error(err);
    }
  };

  // Eliminar tarea
  const handleDelete = async (id) => {
    if (!token) return;
    try {
      await deleteTask(id, token);
      notify('Tarea eliminada');
    } catch (err) {
      notify('No se pudo eliminar la tarea', 'error');
    }
  };

  // Cambiar estado tarea
  const handleToggleStatus = async (id) => {
    if (!token) return;
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    const newStatus = task.status === 'pendiente' ? 'completada' : 'pendiente';

    try {
      await updateTask(id, { status: newStatus }, token);
      notify(`Tarea marcada como "${newStatus}"`, 'info');
    } catch (err) {
      notify('Error al cambiar el estado', 'error');
    }
  };

  // Actualizar tarea
  const handleUpdate = async (id, updatedFields) => {
    if (!token) return;
    try {
      await updateTask(id, updatedFields, token);
      notify('Tarea actualizada');
    } catch (err) {
      notify('No se pudo actualizar la tarea', 'error');
    }
  };

  // Filtrar tareas según búsqueda
  const filteredTasks = tasks.filter(
    (task) =>
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
            <i className="fas fa-search empty-icon" aria-hidden="true" />
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
