import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './userfeedback.css';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
    const [feedbackText, setFeedbackText] = useState('');
    const [userId] = useState(localStorage.getItem('userId') || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/auth/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, feedback_text: feedbackText }),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            await response.json();
            alert('Feedback submitted successfully!');
            setFeedbackText('');
            onFeedbackSubmitted();
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>User ID:</label>
                <input type="text" value={userId} readOnly className="form-input readonly" />
            </div>
            <div className="form-group">
                <label>Feedback:</label>
                <textarea 
                    value={feedbackText} 
                    onChange={(e) => setFeedbackText(e.target.value)} 
                    required 
                    className="form-textarea"
                    placeholder="Share your thoughts..."
                />
            </div>
            <button type="submit" className="submit-btn">Submit Feedback</button>
        </form>
    );
};

const FeedbackList = ({ feedbacks, onFeedbackUpdated, searchTerm }) => {
    const handleEdit = async (id, feedbackText) => {
        const newFeedbackText = prompt('Edit feedback:', feedbackText);
        if (newFeedbackText) {
            try {
                await fetch(`http://localhost:5000/auth/api/feedback/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ feedback_text: newFeedbackText }),
                });
                alert('Feedback updated successfully!');
                onFeedbackUpdated();
            } catch (error) {
                console.error('Error updating feedback:', error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await fetch(`http://localhost:5000/auth/api/feedback/${id}`, { method: 'DELETE' });
                alert('Feedback deleted successfully!');
                onFeedbackUpdated();
            } catch (error) {
                console.error('Error deleting feedback:', error);
            }
        }
    };

    const filteredFeedbacks = feedbacks.filter(feedback => {
        const userIdStr = feedback.user_id?.toString() || '';
        const feedbackTextStr = feedback.feedback_text?.toString() || '';
        const searchLower = searchTerm.toLowerCase();
        
        return (
            userIdStr.toLowerCase().includes(searchLower) ||
            feedbackTextStr.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="feedback-list">
            {filteredFeedbacks.map(feedback => (
                <div key={feedback.id} className="feedback-card">
                    <div className="feedback-content">
                        <p><strong>User ID:</strong> {feedback.user_id}</p>
                        <p><strong>Feedback:</strong> {feedback.feedback_text}</p>
                    </div>
                    <div className="feedback-actions">
                        <button 
                            onClick={() => handleEdit(feedback.id, feedback.feedback_text)} 
                            className="edit-btn"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => handleDelete(feedback.id)} 
                            className="delete-btn"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackUpdated, setFeedbackUpdated] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleFeedbackSubmitted = () => setFeedbackUpdated(prev => !prev);

    const generatePDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["User ID", "Feedback"];
        const tableRows = feedbacks.map(feedback => [feedback.user_id, feedback.feedback_text]);
        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.text("Feedback List", 14, 15);
        doc.save("feedback_list.pdf");
    };

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await fetch('http://localhost:5000/auth/api/feedback');
                const data = await response.json();
                const normalizedFeedbacks = Array.isArray(data) ? data.map(feedback => ({
                    id: feedback.id,
                    user_id: feedback.user_id?.toString() || '',
                    feedback_text: feedback.feedback_text || ''
                })) : [];
                setFeedbacks(normalizedFeedbacks);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
                setFeedbacks([]);
            }
        };
        fetchFeedbacks();
    }, [feedbackUpdated]);

    return (
        <div className="feedback-container">
            <nav className="navbar">
                {[
                    { path: `/user/${localStorage.getItem("userId")}`, text: "Profile" },
                    { path: "/tasks", text: "Tasks" },
                    { path: "/Reminders", text: "Reminders" },
                    { path: "/feedback", text: "Feedback" },
                    { path: "/login", text: "Logout" }
                ].map(({ path, text }) => (
                    <button key={text} onClick={() => navigate(path)} className="nav-btn">
                        {text}
                    </button>
                ))}
            </nav>

            <div className="feedback-header">
                <h1>Feedback Dashboard</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search feedback..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button onClick={generatePDF} className="pdf-btn">📄 Generate Report</button>
                </div>
            </div>

            <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
            <FeedbackList 
                feedbacks={feedbacks} 
                onFeedbackUpdated={handleFeedbackSubmitted} 
                searchTerm={searchTerm} 
            />
        </div>
    );
};

export default Feedback;