const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Todo = require('../models/Todo');

// GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: 1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// POST new todo
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });
    const todo = new Todo({ text });
    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE (toggle completed) - fixed
router.put('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE text (edit) - fixed
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    if (!text) return res.status(400).json({ message: 'Text is required' });
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    todo.text = text;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error('Edit error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE - fixed
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;