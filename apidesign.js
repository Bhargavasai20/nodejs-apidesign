const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

let tasks = [];
let taskId = 1;

app.use(bodyParser.json());

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

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
