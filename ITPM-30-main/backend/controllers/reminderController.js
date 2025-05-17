// controllers/reminderController.js
const connection = require('../db');
const schedule = require('node-schedule');
const { sendEmail } = require('./emailService'); // Import the sendEmail function

// Function to send notification
const sendNotification = (userId, taskId) => {
  const query = 'SELECT * FROM tasks WHERE id = ?';
  connection.query(query, [taskId], (err, results) => {
    if (err) {
      console.error("Error fetching task details:", err.message);
      return;
    }
    const task = results[0];
    if (task) {
      const userQuery = 'SELECT email FROM users WHERE id = ?';
      connection.query(userQuery, [userId], (err, userResults) => {
        if (err) {
          console.error("Error fetching user email:", err.message);
          return;
        }
        const user = userResults[0];
        if (user) {
          const emailSubject = `Reminder: ${task.title}`;
          const emailText = `Task: ${task.title}\nDescription: ${task.description}\nDue Date: ${new Date(task.due_date).toLocaleString()}`;
          sendEmail(user.email, emailSubject, emailText); // Use the sendEmail function
        }
      });
    }
  });
};

// Function to schedule notifications
const scheduleNotification = (userId, taskId, reminderTime) => {
  const date = new Date(reminderTime);
  schedule.scheduleJob(date, () => {
    sendNotification(userId, taskId);
  });
};

// Create a reminder
exports.createReminder = (req, res) => {
  const { user_id, task_id, reminder_time } = req.body;

  const query = `
    INSERT INTO reminders (user_id, task_id, reminder_time) 
    VALUES (?, ?, ?)
  `;
  connection.query(query, [user_id, task_id, reminder_time], (err, results) => {
    if (err) {
      console.error("Error creating reminder:", err.message);
      return res.status(500).json({ error: err.message });
    }

    // Schedule a notification
    scheduleNotification(user_id, task_id, reminder_time);

    res.status(201).json({ message: 'Reminder created successfully', reminderId: results.insertId });
  });
};

// Update a reminder
exports.updateReminder = (req, res) => {
  const { id } = req.params;
  const { reminder_time } = req.body;
  const query = 'UPDATE reminders SET reminder_time = ? WHERE id = ?';
  connection.query(query, [reminder_time, id], (err) => {
    if (err) {
      console.error("Error updating reminder:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Reminder updated' });
  });
};

// Delete a reminder
exports.deleteReminder = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM reminders WHERE id = ?';
  connection.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting reminder:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Reminder deleted' });
  });
};

// Automatically delete expired reminders
const deleteExpiredReminders = async () => {
  try {
    await connection.query('DELETE FROM reminders WHERE reminder_time < NOW()');
  } catch (error) {
    console.error('Failed to delete expired reminders:', error);
  }
};

// Schedule the deletion of expired reminders every hour
setInterval(deleteExpiredReminders,  360000); // 1 hour in milliseconds