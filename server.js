const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/todo-list', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Task schema and model
const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  done: { type: Boolean, default: false },
  order: { type: Number, default: 0 }, // Field for task order
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'low' }, // Field for task priority
  dueDate: { type: Date }, // Add dueDate field
});

const Task = mongoose.model('Task', taskSchema);

// Routes
// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ order: 1 }); // Sort tasks by order
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving tasks.' });
  }
});

// Add a new task
app.post('/tasks', (req, res) => {
    const { description, dueDate, priority } = req.body;

    // Ensure all fields are provided
    if (!description || !dueDate || !priority) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new task object
    const newTask = {
        id: Date.now(),
        description,
        dueDate,
        priority,
        createdAt: new Date(),
    };

    tasks.push(newTask); // Assuming you have a tasks array to store tasks
    res.status(201).json(newTask); // Respond with the newly created task
});

// Update a task description
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { description, priority, dueDate } = req.body; // Include dueDate

  if (!description) {
    return res.status(400).json({ error: 'Task description is required.' });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { description, priority, dueDate }, { new: true }); // Include dueDate in update
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the task.' });
  }
});

// Toggle task done state
app.patch('/tasks/:id/toggle', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    task.done = !task.done;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while toggling the task done state.' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the task.' });
  }
});

// Update task order
app.patch('/tasks/order', async (req, res) => {
  const { orderedTaskIds } = req.body; // Expect an array of task IDs in the new order

  if (!Array.isArray(orderedTaskIds)) {
    return res.status(400).json({ error: 'Invalid order data.' });
  }

  try {
    await Promise.all(orderedTaskIds.map((id, index) => {
      return Task.findByIdAndUpdate(id, { order: index });
    }));

    res.status(200).json({ message: 'Task order updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the task order.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
console.log('Task Description:', taskDescription);
console.log('Due Date:', dueDate);
console.log('Task Priority:', taskPriority);