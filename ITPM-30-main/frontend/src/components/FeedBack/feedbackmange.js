import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Feedback.css";

// FeedbackForm Component
// const FeedbackForm = ({ onFeedbackSubmitted }) => {
//   const [feedbackText, setFeedbackText] = useState("");
//   const [userId] = useState(localStorage.getItem("userId") || "Admin");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:5000/auth/api/feedback", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ user_id: userId, feedback_text: feedbackText }),
//       });

//       if (!response.ok) throw new Error("Failed to submit feedback");
//       setFeedbackText("");
//       onFeedbackSubmitted();
//       toast.success("Feedback submitted successfully!");
//     } catch (error) {
//       toast.error(`Error submitting feedback: ${error.message}`);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="feedback-form">
//       <div className="form-group">
//         <label htmlFor="user-id">User ID:</label>
//         <input
//           id="user-id"
//           type="text"
//           value={userId}
//           className="form-input readonly"
//           readOnly
//           aria-label="User ID"
//         />
//       </div>
//       <div className="form-group">
//         <label htmlFor="feedback-text">Feedback:</label>
//         <textarea
//           id="feedback-text"
//           value={feedbackText}
//           onChange={(e) => setFeedbackText(e.target.value)}
//           className="form-textarea"
//           required
//           aria-label="Feedback text"
//         />
//       </div>
//       <button type="submit" className="submit-btn" aria-label="Submit feedback">
//         Submit Feedback
//       </button>
//     </form>
//   );
// };

// FeedbackList Component
const FeedbackList = ({ onFeedbackUpdated, feedbacks, searchTerm }) => {
  const handleEdit = async (id, feedbackText) => {
    const newFeedbackText = prompt("Edit feedback:", feedbackText);
    if (newFeedbackText) {
      try {
        const response = await fetch(`http://localhost:5000/auth/api/feedback/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedback_text: newFeedbackText }),
        });
        if (!response.ok) throw new Error("Failed to update feedback");
        toast.success("Feedback updated successfully!");
        onFeedbackUpdated();
      } catch (error) {
        toast.error(`Error updating feedback: ${error.message}`);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      const response = await fetch(`http://localhost:5000/auth/api/feedback/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete feedback");
      toast.success("Feedback deleted successfully!");
      onFeedbackUpdated();
    } catch (error) {
      toast.error(`Error deleting feedback: ${error.message}`);
    }
  };

  // Filter feedbacks by user ID, safely converting user_id to string
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const userIdStr = feedback.user_id != null ? String(feedback.user_id) : "";
    return userIdStr.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="feedback-list">
      {filteredFeedbacks.length === 0 ? (
        <div className="no-feedback">
          {searchTerm ? "No feedback found for this User ID." : "No feedback available."}
        </div>
      ) : (
        filteredFeedbacks.map((feedback) => (
          <div key={feedback.id} className="feedback-card">
            <div className="feedback-content">
              <p>
                <strong>User ID:</strong> {feedback.user_id}
              </p>
              <p>
                <strong>Feedback:</strong> {feedback.feedback_text}
              </p>
            </div>
            <div className="feedback-actions">
              <button
                onClick={() => handleEdit(feedback.id, feedback.feedback_text)}
                className="edit-btn"
                aria-label={`Edit feedback ${feedback.id}`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(feedback.id)}
                className="delete-btn"
                aria-label={`Delete feedback ${feedback.id}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Combined Feedback Component
const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbackUpdated, setFeedbackUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/auth/api/feedback");
        if (!response.ok) throw new Error("Failed to fetch feedbacks");
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        toast.error(`Error fetching feedbacks: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedbacks();
  }, [feedbackUpdated]);

  const handleFeedbackSubmitted = () => {
    setFeedbackUpdated((prev) => !prev);
  };

  const handleFeedbackUpdated = () => {
    setFeedbackUpdated((prev) => !prev);
  };

  const generatePDF = () => {
    if (feedbacks.length === 0) {
      toast.warn("No feedback to generate a report.");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("User Feedback Report", 14, 15);
    doc.autoTable({
      head: [["User ID", "Feedback"]],
      body: feedbacks.map((feedback) => [String(feedback.user_id), feedback.feedback_text]),
      startY: 25,
      styles: { fontSize: 10, cellPadding: 5 },
      theme: "grid",
    });
    doc.save("user_feedback_report.pdf");
    toast.success("PDF generated successfully!");
  };

  return (
    <div className="page-wrapper">
      <div className="feedback-container">
        <nav className="navbar">
          <button onClick={() => navigate("/login")} className="logout-btn" aria-label="Logout">
            Logout
          </button>
        </nav>
        <div className="feedback-header">
          <h1>Feedback List</h1>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search feedback by user ID"
          />
          <button
            onClick={generatePDF}
            className="generate-btn"
            aria-label="Generate PDF report"
          >
            📄 Generate PDF
          </button>
        </div>
        {isLoading ? (
          <div className="feedback-list">
            <div className="skeleton-card">
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        ) : (
          <>
            {/* <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} /> */}
            <FeedbackList
              onFeedbackUpdated={handleFeedbackUpdated}
              feedbacks={feedbacks}
              searchTerm={searchTerm}
            />
          </>
        )}
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Feedback;