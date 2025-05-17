const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController'); // Ensure this path is correct

// Create a new task
router.post('/tasks', taskController.createTask);

// Get all tasks for a specific user
router.get('/tasks/user/:user_id', taskController.getTasksByUser );

// Get all categories
router.get('/categories', taskController.getCategory); // Fixed function name to match the controller

// Update task status
router.put('/tasks/:id/status', taskController.updateTaskStatus);

// Update task details
router.put('/tasks/:id', taskController.updateTask);

// Delete task
router.delete('/tasks/:id', taskController.deleteTask);

// Create a reminder
router.post('/reminders', taskController.createReminder);

// Route to get all reminders
router.get('/reminders', taskController.getAllReminders);

// Update a reminder
router.put('/reminders/:id', taskController.updateReminder);

// Delete a reminder
router.delete('/reminders/:id', taskController.deleteReminder);

module.exports = router;