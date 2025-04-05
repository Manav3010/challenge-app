const Task = require('../models/Task');

// Get all tasks for the logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add a new task
const addTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ msg: 'Title is required' });
  }

  try {
    const task = new Task({
      userId: req.user.id,
      title,
      description,
      status: 'ongoing' // default when created
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update an existing task
const updateTask = async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const updatedFields = {};
    if (title !== undefined) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (status !== undefined) updatedFields.status = status;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updatedFields,
      { new: true }
    );

    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask
};
