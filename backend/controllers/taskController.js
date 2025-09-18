const mongoose = require('mongoose');
const Task = require('../models/taskModel');

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({ message: 'Invalid user ID in assignedTo field.' });
    }

    const task = new Task({
      title,
      description,
      dueDate: dueDate || null,
      priority: priority || 'medium',
      createdBy: req.user._id,
      assignedTo: assignedTo || null
    });

    await task.save();
    await task.populate('assignedTo', 'name email');

    res.status(201).json({
      message: 'Task has been created successfully.',
      task
    });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Unable to create task. Please try again later.' });
  }
};

// fetch tasks
exports.getTasks = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const filter = {
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    };

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');


    res.json({
      message: 'Your tasks (created by you or assigned to you).',
      page,
      limit,
      total,
      tasks
    });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Unable to fetch tasks. Please try again later.' });
  }
};



exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID provided.' });
    }

    const task = await Task.findById(id).populate('assignedTo', 'name email').populate('createdBy', 'name email');
    if (!task) {
      return res.status(404).json({ message: 'Task not found. It may have been removed.' });
    }

    res.json({
      message: 'Task details fetched successfully.',
      task
    });
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({ message: 'Unable to fetch task details. Please try again later.' });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID provided.' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this task.' });
    }

    const allowed = ['title', 'description', 'dueDate', 'priority', 'status', 'assignedTo'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (updates.assignedTo && !mongoose.Types.ObjectId.isValid(updates.assignedTo)) {
      return res.status(400).json({ message: 'Invalid user ID in assignedTo field.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).populate('assignedTo', 'name email');

    res.json({
      message: 'Task updated successfully.',
      task: updatedTask
    });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Unable to update task. Please try again later.' });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID provided.' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this task.' });
    }

    await Task.findByIdAndDelete(id);

    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Unable to delete task. Please try again later.' });
  }
};

