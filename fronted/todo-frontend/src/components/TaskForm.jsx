import React, { useState, useRef } from 'react';
import '../styles/TaskForm.css';

const pastelColors = [
  '#F8BBD0', '#FDCBBA', '#FFF9C4',
  '#C8E6C9', '#B3E5FC', '#D1C4E9',
  '#FFECB3', '#E1F5FE'
];

const TaskForm = ({ onSubmit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [task, setTask] = useState({
    title: '',
    description: '',
    color: '#ffffff'
  });

  const formRef = useRef(null);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleColorSelect = (color) => {
    setTask(prev => ({ ...prev, color }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title && !task.description) return;

    const taskWithDate = {
      ...task,
      createdAt: new Date().toISOString()
    };

    onSubmit(taskWithDate);
    setTask({ title: '', description: '', color: '#ffffff' });
    setIsExpanded(false);
  };

  const handleBlur = (e) => {
    if (!formRef.current.contains(e.relatedTarget)) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="note-form-container taskform-component" onBlur={handleBlur} ref={formRef}>
      <form className={`note-form ${isExpanded ? 'expanded' : ''}`} onSubmit={handleSubmit}>
        {isExpanded && (
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={task.title}
            onChange={handleChange}
            className="note-title-input"
            autoFocus
          />
        )}

        <textarea
          name="description"
          placeholder="Agregar una nota..."
          value={task.description}
          onFocus={() => setIsExpanded(true)}
          onChange={handleChange}
          className="note-description-input"
        />

        {isExpanded && (
          <div className="note-form-footer">
            <div className="color-palette">
              {pastelColors.map((color) => (
                <button
                  type="button"
                  key={color}
                  className={`color-swatch ${task.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>

            <button type="submit">Crear</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default TaskForm;
