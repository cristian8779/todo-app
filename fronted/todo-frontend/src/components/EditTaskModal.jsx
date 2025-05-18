import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faFont, faBold, faItalic } from '@fortawesome/free-solid-svg-icons';
import '../styles/EditTaskModal.css';

Modal.setAppElement('#root');

const EditTaskModal = ({ task, isOpen, onClose, onUpdate }) => {
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    color: task.color || '#ffffff',
    fontSize: task.fontSize || '16px',
    fontWeight: task.fontWeight || 'normal',
    fontStyle: task.fontStyle || 'normal',
  });

  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);

  const colorPalettes = [
    '#F8BBD0', '#FDCBBA', '#FFF9C4', '#C8E6C9', '#B3E5FC', '#D1C4E9', '#FFECB3', '#E1F5FE'
  ];

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px'];

  const handleColorSelect = (color) => {
    setEditedTask({ ...editedTask, color });
  };

  const handleFontSizeSelect = (size) => {
    setEditedTask({ ...editedTask, fontSize: size });
  };

  const toggleBold = () => {
    setEditedTask((prevState) => ({
      ...prevState,
      fontWeight: prevState.fontWeight === 'bold' ? 'normal' : 'bold',
    }));
  };

  const toggleItalic = () => {
    setEditedTask((prevState) => ({
      ...prevState,
      fontStyle: prevState.fontStyle === 'italic' ? 'normal' : 'italic',
    }));
  };

  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    if (
      editedTask.title !== task.title ||
      editedTask.description !== task.description ||
      editedTask.color !== task.color ||
      editedTask.fontSize !== task.fontSize ||
      editedTask.fontWeight !== task.fontWeight ||
      editedTask.fontStyle !== task.fontStyle
    ) {
      onUpdate(task._id, editedTask);
    }
    onClose();
  };

  useEffect(() => {
    setEditedTask({
      title: task.title,
      description: task.description,
      color: task.color || '#ffffff',
      fontSize: task.fontSize || '16px',
      fontWeight: task.fontWeight || 'normal',
      fontStyle: task.fontStyle || 'normal',
    });
  }, [task, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="task-modal"
      overlayClassName="modal-overlay"
      style={{
        content: {
          backgroundColor: editedTask.color,
        },
      }}
    >
      <div className="modal-content">
        <input
          type="text"
          name="title"
          value={editedTask.title}
          onChange={handleChange}
          placeholder="Título"
          className="modal-title"
        />

        <textarea
          name="description"
          value={editedTask.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="modal-description"
          style={{
            fontSize: editedTask.fontSize,
            fontWeight: editedTask.fontWeight,
            fontStyle: editedTask.fontStyle,
          }}
        />

        <div className="modal-actions">
          <FontAwesomeIcon
            icon={faPalette}
            title="Elegir color"
            className="action-icon"
            onClick={() => setShowColorPalette(!showColorPalette)}
          />

          {showColorPalette && (
            <div className="color-palettes">
              {colorPalettes.map((color) => (
                <button
                  key={color}
                  style={{ backgroundColor: color }}
                  className={`color-palette-btn ${editedTask.color === color ? 'selected' : ''}`}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          )}

          <FontAwesomeIcon
            icon={faFont}
            title="Elegir tamaño de fuente"
            className="action-icon"
            onClick={() => setShowFontSizePicker(!showFontSizePicker)}
          />

          {showFontSizePicker && (
            <div className="font-size-picker">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  style={{ fontSize: size }}
                  className={`font-size-btn ${editedTask.fontSize === size ? 'selected' : ''}`}
                  onClick={() => handleFontSizeSelect(size)}
                >
                  A
                </button>
              ))}
            </div>
          )}

          <FontAwesomeIcon
            icon={faBold}
            title="Negrita"
            className={`action-icon ${editedTask.fontWeight === 'bold' ? 'selected' : ''}`}
            onClick={toggleBold}
          />
          <FontAwesomeIcon
            icon={faItalic}
            title="Cursiva"
            className={`action-icon ${editedTask.fontStyle === 'italic' ? 'selected' : ''}`}
            onClick={toggleItalic}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditTaskModal;
