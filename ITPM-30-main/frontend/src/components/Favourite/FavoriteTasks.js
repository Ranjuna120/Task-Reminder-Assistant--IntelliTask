import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For better table formatting in PDF
import './FavoriteTasks.css';

const FavoriteTasks = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login"); // Redirect if not authenticated
      return;
    }
    fetchFavorites();
  }, [userId, navigate]);

  const fetchFavorites = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5000/auth/api/favorites/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch favorite tasks");
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (taskId) => {
    if (window.confirm("Are you sure you want to remove this task from favorites?")) {
      try {
        const response = await fetch("http://localhost:5000/auth/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, task_id: taskId }),
        });
        if (!response.ok) throw new Error("Failed to remove favorite");
        fetchFavorites();
        alert("Task removed from favorites!");
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const generateReport = () => {
    if (favorites.length === 0) {
      alert("No favorite tasks to generate a report.");
      return;
    }

    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    doc.setFontSize(16);
    doc.text(`Favorite Tasks Report - ${today}`, 14, 20);
    
    const tableColumn = ["ID", "Title", "Description", "Priority", "Status", "Due Date"];
    const tableRows = favorites.map(task => [
      task.id,
      task.title,
      task.description || "N/A",
      task.priority,
      task.status,
      new Date(task.due_date).toLocaleString()
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [44, 62, 80] },
    });

    doc.save("Favorite_Tasks_Report.pdf");
  };

  return (
    <div className="favorite-tasks-container">
      <nav className="navbar">
        {[
          { path: `/user/${userId}`, text: "Profile" },
          { path: "/tasks", text: "Tasks" },
          { path: "/Reminders", text: "Reminders" },
          { path: "/feedback", text: "Feedback" },
          { path: "/favourites", text: "Favourites" },
          { path: "/login", text: "Logout" },
        ].map(({ path, text }) => (
          <button key={text} onClick={() => navigate(path)} className="nav-btn">
            {text}
          </button>
        ))}
      </nav>

      <div className="favorite-tasks-content">
        <div className="header-section">
          <h1>Favorite Tasks</h1>
          <p className="subtitle">Your curated list of top tasks</p>
          <button onClick={generateReport} className="report-btn">📄 Generate Report</button>
        </div>

        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error-message">{error}</p>}

        {favorites.length === 0 ? (
          <p className="no-tasks">No favorite tasks yet. Add some from your task list!</p>
        ) : (
          <div className="tasks-grid">
            {favorites.map((task) => (
              <div key={task.id} className="task-card">
                <h3>{task.title}</h3>
                <p className="description">{task.description || "No description"}</p>
                <div className="task-details">
                  <span><strong>ID:</strong> {task.id}</span>
                  <span><strong>Priority:</strong> {task.priority}</span>
                  <span><strong>Status:</strong> {task.status}</span>
                  <span><strong>Due:</strong> {new Date(task.due_date).toLocaleString()}</span>
                </div>
                <button onClick={() => removeFavorite(task.id)} className="remove-btn">
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteTasks;