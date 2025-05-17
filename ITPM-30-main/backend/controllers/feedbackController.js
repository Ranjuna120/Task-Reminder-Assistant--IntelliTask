const connection = require('../db');

exports.getAllFeedback = (req, res) => {
    connection.query('SELECT * FROM feedback', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.createFeedback = (req, res) => {
    const { user_id, feedback_text } = req.body;
    connection.query('INSERT INTO feedback (user_id, feedback_text) VALUES (?, ?)', [user_id, feedback_text], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: results.insertId, user_id, feedback_text });
    });
};

exports.updateFeedback = (req, res) => {
    const { id } = req.params;
    const { feedback_text } = req.body;
    connection.query('UPDATE feedback SET feedback_text = ? WHERE id = ?', [feedback_text, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ id, feedback_text });
    });
};

exports.deleteFeedback = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM feedback WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.status(204).send();
    });
};

exports.respondToFeedback = (req, res) => {
    const { id } = req.params;
    const { response_text } = req.body;
    connection.query('UPDATE feedback SET response_text = ? WHERE id = ?', [response_text, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ id, response_text });
    });
};