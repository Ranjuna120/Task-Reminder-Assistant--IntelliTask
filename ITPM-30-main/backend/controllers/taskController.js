const connection = require('../db');
const schedule = require('node-schedule');

const sendStartNotification = async (userId, taskId) => {
  try {
    const [task] = await connection.promise().query(
      'SELECT * FROM tasks WHERE id = ?', [taskId]
    );
    if (task.length) {
      console.log(`START NOTIFICATION: User ${userId}, Task "${task[0].title}" has started!`);
    }
  } catch (error) {
    console.error("Notification error:", error);
  }
};

const sendNotification = async (userId, taskId) => {
  try {
    const [task] = await connection.promise().query(
      'SELECT * FROM tasks WHERE id = ?', [taskId]
    );
    if (task.length) {
      console.log(`REMINDER: User ${userId}, Task: ${task[0].title}, Due: ${new Date(task[0].due_date).toLocaleString()}`);
    }
  } catch (error) {
    console.error("Notification error:", error);
  }
};

const scheduleNotification = (userId, taskId, time, type = "reminder") => {
  const date = new Date(time);
  if (date > new Date()) {
    schedule.scheduleJob(date, () =>
      type === "start" ? sendStartNotification(userId, taskId) : sendNotification(userId, taskId)
    );
  }
};

exports.createTask = async (req, res) => {
  const { user_id, category_id, title, description, due_date, start_date, priority, status, mood } = req.body;

  try {
    // Check for overlapping tasks
    const [existingTasks] = await connection.promise().query(
      `SELECT * FROM tasks 
       WHERE user_id = ? 
       AND (
         (start_date <= ? AND due_date >= ?) 
         OR (start_date <= ? AND due_date >= ?)
       )`,
      [user_id, due_date, start_date, start_date, due_date]
    );

    if (existingTasks.length > 0) {
      return res.status(400).json({ error: 'Task conflicts with existing schedule' });
    }

    // Validate "Stressed" mood restriction
    if (mood === "Stressed") {
      const [recentStressedTasks] = await connection.promise().query(
        `SELECT * FROM tasks 
         WHERE user_id = ? 
         AND mood = 'Stressed' 
         AND due_date > DATE_SUB(NOW(), INTERVAL 2 HOUR)`,
        [user_id]
      );

      if (recentStressedTasks.length > 0) {
        return res.status(400).json({
          error: 'Cannot add a Stressed task within 2 hours of another Stressed task'
        });
      }
    }

    const [result] = await connection.promise().query(
      'INSERT INTO tasks (user_id, category_id, title, description, due_date, start_date, priority, status, mood) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, category_id, title, description, due_date, start_date, priority, status || 'pending', mood || 'Energetic']
    );

    if (start_date) scheduleNotification(user_id, result.insertId, start_date, "start");
    if (due_date) scheduleNotification(user_id, result.insertId, due_date);

    res.status(201).json({ message: 'Task created', taskId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const [results] = await connection.promise().query('SELECT id, name FROM categories');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  const { due_date } = req.query;
  try {
    const query = due_date
      ? 'SELECT * FROM tasks WHERE due_date LIKE ?'
      : 'SELECT tasks.*, users.username, categories.name AS category_name FROM tasks JOIN users ON tasks.user_id = users.id LEFT JOIN categories ON tasks.category_id = categories.id';

    const [results] = await connection.promise().query(query, due_date ? [`${due_date}%`] : []);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasksByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const [results] = await connection.promise().query(
      'SELECT tasks.*, categories.name AS category_name FROM tasks LEFT JOIN categories ON tasks.category_id = categories.id WHERE tasks.user_id = ?',
      [user_id]
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await connection.promise().query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, start_date, priority, category_id, status, mood } = req.body;
  try {
    await connection.promise().query(
      'UPDATE tasks SET title = ?, description = ?, due_date = ?, start_date = ?, priority = ?, category_id = ?, status = ?, mood = ? WHERE id = ?',
      [title, description, due_date, start_date, priority, category_id, status, mood, id]
    );
    res.status(200).json({ message: 'Task updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await connection.promise().query('DELETE FROM tasks WHERE id = ?', [id]);
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllReminders = async (req, res) => {
  try {
    const [results] = await connection.promise().query(
      'SELECT reminders.*, tasks.title AS task_title, users.username FROM reminders JOIN tasks ON reminders.task_id = tasks.id JOIN users ON reminders.user_id = users.id'
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createReminder = async (req, res) => {
  const { user_id, task_id, reminder_time } = req.body;
  try {
    const [result] = await connection.promise().query(
      'INSERT INTO reminders (user_id, task_id, reminder_time) VALUES (?, ?, ?)',
      [user_id, task_id, reminder_time]
    );

    scheduleNotification(user_id, task_id, reminder_time);
    res.status(201).json({ message: 'Reminder created', reminderId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReminder = async (req, res) => {
  const { id } = req.params;
  const { reminder_time } = req.body;
  try {
    await connection.promise().query('UPDATE reminders SET reminder_time = ? WHERE id = ?', [reminder_time, id]);
    res.status(200).json({ message: 'Reminder updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  const { id } = req.params;
  try {
    await connection.promise().query('DELETE FROM reminders WHERE id = ?', [id]);
    res.status(200).json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cleanup expired reminders
setInterval(async () => {
  try {
    await connection.promise().query('DATE FROM reminders WHERE reminder_time < NOW()');
    console.log("Expired reminders cleaned up");
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}, 3600000);