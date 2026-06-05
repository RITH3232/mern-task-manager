const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body; // <-- Added dueDate
    const newTask = new Task({ title, description, priority, dueDate, user: req.user.userId });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) { res.status(500).json({ message: 'Error fetching' }); }
};

exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });
    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) { res.status(500).json({ message: 'Error updating' }); }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) { res.status(500).json({ message: 'Error deleting' }); }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });
    task.status = req.body.status;
    await task.save();
    res.json(task);
  } catch (error) { res.status(500).json({ message: 'Error updating status' }); }
};