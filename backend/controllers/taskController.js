const Task = require('../models/Task');

// Crear tarea
exports.createTask = async (req, res) => {
  const { title, description, color, fontSize, fontWeight, fontStyle, priority, dueDate } = req.body;
  const io = req.app.get('io');

  if (!title || !description) {
    return res.status(400).json({ error: "El título y la descripción son obligatorios" });
  }

  try {
    const task = new Task({
      title,
      description,
      color: color || '#ffffff',
      fontSize: fontSize || '16px',
      fontWeight: fontWeight || 'normal',
      fontStyle: fontStyle || 'normal',
      priority: priority || 'media',
      dueDate,
      status: 'pendiente',
      userId: req.userId,
    });

    await task.save();

    io.emit('taskCreated', task); // 🔴 Emitir evento en tiempo real

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener tareas
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar tarea
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const io = req.app.get('io');

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Tarea no encontrada o no autorizada" });
    }

    io.emit('taskUpdated', updatedTask); // 🔴 Emitir actualización

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar tarea
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const io = req.app.get('io');

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.userId });

    if (!deletedTask) {
      return res.status(404).json({ error: "Tarea no encontrada o no autorizada" });
    }

    io.emit('taskDeleted', deletedTask._id); // 🔴 Emitir eliminación (solo el ID puede ser suficiente)

    res.status(200).json({ message: "Tarea eliminada con éxito" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
