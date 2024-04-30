// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Sample data: in-memory task storage
let tasks = [];
let taskId = 1;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route for creating a new task
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    const newTask = {
        id: taskId++,
        title,
        description,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Route for retrieving all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Route for retrieving a specific task by ID
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Route for updating a specific task by ID
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: title || tasks[taskIndex].title,
            description: description || tasks[taskIndex].description,
            updatedAt: new Date()
        };
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Route for deleting a specific task by ID
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    if (tasks.length < initialLength) {
        res.sendStatus(204);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
