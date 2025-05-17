const db = require('../db');

// Add task to favorites
exports.addFavorite = (req, res) => {
    const { user_id, task_id } = req.body;

    if (!user_id || !task_id) {
        return res.status(400).json({ error: "User  ID and Task ID are required" });
    }

    db.query('INSERT INTO favorites (user_id, task_id) VALUES (?, ?)', [user_id, task_id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: "Task is already in favorites" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Task added to favorites' });
    });
};

// Get all favorite tasks for a user
exports.getFavorites = (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User  ID is required" });
    }

    db.query(
        'SELECT t.* FROM tasks t JOIN favorites f ON t.id = f.task_id WHERE f.user_id = ?',
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
};

// Remove task from favorites
exports.removeFavorite = (req, res) => {
    const { user_id, task_id } = req.body;

    if (!user_id || !task_id) {
        return res.status(400).json({ error: "User  ID and Task ID are required" });
    }

    db.query('DELETE FROM favorites WHERE user_id = ? AND task_id = ?', [user_id, task_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found in favorites" });
        }
        res.json({ message: 'Task removed from favorites' });
    });
};

// Update favorite task (Example: Update the priority or status of a favorite task)
exports.updateFavorite = (req, res) => {
    const { user_id, task_id, priority, status } = req.body;

    if (!user_id || !task_id) {
        return res.status(400).json({ error: "User  ID and Task ID are required" });
    }

    const updateFields = [];
    const values = [];

    if (priority) {
        updateFields.push('priority = ?');
        values.push(priority);
    }
    if (status) {
        updateFields.push('status = ?');
        values.push(status);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
    }

    values.push(user_id, task_id);

    const query = `UPDATE favorites SET ${updateFields.join(', ')} WHERE user_id = ? AND task_id = ?`;

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found or not in favorites" });
        }
        res.json({ message: 'Favorite task updated' });
    });
};