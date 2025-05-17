import React, { useEffect, useState } from "react";
import UpdateTask from "./updatetask";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TaskList.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("due_date");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("Please log in to view your tasks.");
      setLoading(false);
      return;
    }
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchTasks(), fetchFavorites()]);
    } catch (err) {
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    const response = await fetch(`http://localhost:5000/auth/api/tasks/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch tasks.");
    const data = await response.json();
    setTasks(data);
    scheduleReminders(data);
  };

  const fetchFavorites = async () => {
    const response = await fetch(`http://localhost:5000/auth/api/favorites/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch favorites.");
    const favData = await response.json();
    setFavorites(favData.map((fav) => fav.task_id));
  };

  const scheduleReminders = (taskList) => {
    taskList.forEach((task) => {
      if (task.status === "completed") return;

      const notify = (time, message) => {
        const diff = new Date(time).getTime() - Date.now();
        if (diff > 0 && diff <= 5 * 60 * 1000) {
          setTimeout(() => toast[message.type](message.text(task.title)), diff);
        }
      };

      if (task.due_date) {
        notify(task.due_date, {
          type: "warn",
          text: (title) => `Reminder: "${title}" is due soon!`,
        });
      }
      if (task.start_date) {
        notify(task.start_date, {
          type: "info",
          text: (title) => `"${title}" has started!`,
        });
      }
    });
  };

  const handleFavoriteToggle = async (taskId) => {
    const isFavorited = favorites.includes(taskId);
    try {
      const response = await fetch(`http://localhost:5000/auth/api/favorites`, {
        method: isFavorited ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, task_id: taskId }),
      });
      if (!response.ok) throw new Error(`Failed to ${isFavorited ? "remove" : "add"} favorite`);
      setFavorites((prev) =>
        isFavorited ? prev.filter((id) => id !== taskId) : [...prev, taskId]
      );
      toast.success(`Task ${isFavorited ? "unfavorited" : "favorited"} successfully!`);
    } catch (error) {
      toast.error(`Favorite action failed: ${error.message}`);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const response = await fetch(`http://localhost:5000/auth/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setFavorites((prev) => prev.filter((id) => id !== taskId)); // Remove from favorites if present
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Task Report", 14, 20);
    doc.autoTable({
      head: [["ID", "Title", "Description", "Priority", "Status", "Due Date", "Start Date", "Category", "Mood"]],
      body: filteredTasks.map((task) => [
        task.id,
        task.title,
        task.description.slice(0, 30) + (task.description.length > 30 ? "..." : ""),
        task.priority,
        task.status,
        task.due_date ? new Date(task.due_date).toLocaleString() : "N/A",
        task.start_date ? new Date(task.start_date).toLocaleString() : "N/A",
        task.category_name || "Uncategorized",
        task.mood,
      ]),
      startY: 30,
      styles: { fontSize: 10, cellPadding: 5 },
      theme: "grid",
    });
    doc.save(`task_report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Filtering, Sorting, and Pagination Logic
  const filteredTasks = tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === "all" || task.status === filterStatus)
    )
    .sort((a, b) => {
      if (sortBy === "due_date") {
        return (a.due_date || "Z") < (b.due_date || "Z") ? -1 : 1;
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const TaskHeader = () => (
    <header className="task-header">
      <h1>Your Tasks</h1>
      <div className="task-controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Search tasks"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
          aria-label="Sort by"
        >
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
        <button className="pdf-btn" onClick={generatePDF} aria-label="Export to PDF">
          📄 Generate Report
        </button>
      </div>
    </header>
  );

  const TaskCard = ({ task, isFavorited, onFavoriteToggle, onEdit, onDelete }) => (
    <div className="task-card" role="article" aria-labelledby={`task-title-${task.id}`}>
      <div className="task-header">
        <h3 id={`task-title-${task.id}`}>{task.title}</h3>
        <button
          className="favorite-btn"
          onClick={() => onFavoriteToggle(task.id)}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? "⭐" : "☆"}
        </button>
      </div>
      <p className="task-desc">{task.description}</p>
      <div className="task-details">
        <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
        <span className="status">{task.status}</span>
      </div>
      <div className="task-dates">
        <p>Start: {task.start_date ? new Date(task.start_date).toLocaleDateString() : "N/A"}</p>
        <p>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}</p>
      </div>
      <p className="task-category">Category: {task.category_name || "Uncategorized"}</p>
      <p className="task-mood">Mood: {task.mood}</p>
      <div className="task-actions">
        <button
          className="edit-btn"
          onClick={onEdit}
          aria-label={`Edit task: ${task.title}`}
        >
          Edit
        </button>
        <button
          className="delete-btn"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete task: ${task.title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="task-grid">
      {Array(tasksPerPage)
        .fill()
        .map((_, index) => (
          <div className="skeleton-card" key={index}>
            <div className="skeleton-header"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-details"></div>
            <div className="skeleton-dates"></div>
            <div className="skeleton-btn"></div>
          </div>
        ))}
    </div>
  );

  const Pagination = () => (
    <div className="pagination">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="task-list-container">
      <TaskHeader />
      {loading && <LoadingSkeleton />}
      {error && <div className="error-msg">{error}</div>}
      {!loading && !error && filteredTasks.length === 0 && (
        <div className="no-tasks">No tasks found. Start adding some!</div>
      )}
      {!loading && !error && filteredTasks.length > 0 && (
        <>
          <div className="task-grid">
            {paginatedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isFavorited={favorites.includes(task.id)}
                onFavoriteToggle={handleFavoriteToggle}
                onEdit={() => setSelectedTaskId(task.id)}
                onDelete={handleDelete} // Pass handleDelete to TaskCard
              />
            ))}
          </div>
          <Pagination />
        </>
      )}
      {selectedTaskId && (
        <UpdateTask
          taskId={selectedTaskId}
          onClose={() => {
            setSelectedTaskId(null);
            fetchTasks();
          }}
        />
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default TaskList;