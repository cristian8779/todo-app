import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import '../styles/TaskCard.css';
import EditTaskModal from './EditTaskModal';

const TaskCard = ({ task, onDelete, onToggleStatus, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const textStyle = {
    fontSize: task.fontSize || '16px',
    fontWeight: task.fontWeight || 'normal',
    fontStyle: task.fontStyle || 'normal',
    wordWrap: 'break-word',
  };

  const handleConfirmDelete = () => {
    onDelete(task._id);
    setShowConfirmDelete(false);
  };

  // ✅ Formato de fecha/hora dinámico según antigüedad
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (diffMs < ONE_DAY) {
      return `Actualizado a las ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `Actualizado el ${date.toLocaleDateString()}`;
    }
  };

  return (
    <>
      <div
        className={`task-card-note ${task.status === 'completada' ? 'completed' : ''}`}
        style={{ backgroundColor: task.color || '#ffffff' }}
      >
        <div className="note-header">
          <h3 onClick={() => setIsModalOpen(true)} style={textStyle}>
            {task.title || 'Sin título'}
          </h3>
        </div>
        <div className="note-description">
          <p style={textStyle}>
            {task.description || 'Agregar descripción'}
          </p>
        </div>
        <div className="note-footer">
          <small className="note-date">
            {formatDate(task.updatedAt)}
          </small>
          <div className="note-actions">
            <FontAwesomeIcon
              icon={faCheckCircle}
              title="Marcar como completada"
              className="action-icon"
              onClick={() => onToggleStatus(task._id)}
              color={task.status === 'pendiente' ? '#4caf50' : '#999'}
            />
            <FontAwesomeIcon
              icon={faTrashAlt}
              title="Eliminar"
              className="action-icon"
              onClick={() => setShowConfirmDelete(true)}
              color="#e74c3c"
            />
            <FontAwesomeIcon
              icon={faEdit}
              title="Editar"
              className="action-icon"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <EditTaskModal
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={onUpdate}
      />

      {/* Modal de confirmación de eliminación */}
      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <p>¿Seguro que deseas eliminar la tarea?</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowConfirmDelete(false)}>Cancelar</button>
              <button className="delete-btn" onClick={handleConfirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
