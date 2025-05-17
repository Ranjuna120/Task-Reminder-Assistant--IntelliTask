// controllers/reminderRoutes.js
const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');

// Route to create a reminder
router.post('/reminders', reminderController.createReminder);

// Route to update a reminder
router.put('/reminders:id', reminderController.updateReminder);

// Route to delete a reminder
router.delete('/reminders:id', reminderController.deleteReminder);

// Route to get all reminders (optional, if you want to fetch reminders)
router.get('/reminders', (req, res) => {
  const query = `
    SELECT reminders.*, tasks.title AS task_title, users.username 
    FROM reminders
    JOIN tasks ON reminders.task_id = tasks.id
    JOIN users ON reminders.user_id = users.id
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reminders:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

module.exports = router;