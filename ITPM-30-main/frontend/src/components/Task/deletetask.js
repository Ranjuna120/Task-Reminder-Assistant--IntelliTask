import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DeleteTask.css";

const DeleteTask = () => {
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!taskId.trim()) {
      toast.warn("Please enter a Task ID.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Adjust based on your auth setup
      const response = await fetch(`http://localhost:5000/auth/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error occurred");
      }

      toast.success("Task deleted successfully!");
      setTaskId(""); // Reset input after success
    } catch (error) {
      setError(`Failed to delete task: ${error.message}`);
      toast.error(`Delete failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) handleDelete();
  };

  return (
    <div className="delete-task-container">
      <h1>Delete Task</h1>
      {loading && <div className="loader">Deleting task...</div>}
      {error && (
        <div className="error-msg">
          {error}
          <br />
          <small>Check the Task ID or server status.</small>
        </div>
      )}
      {!loading && (
        <div className="form-group">
          <label htmlFor="task-id-input">Task ID:</label>
          <input
            id="task-id-input"
            type="text"
            placeholder="Enter Task ID"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            onKeyPress={handleKeyPress}
            className="task-id-input"
            aria-label="Task ID to delete"
            disabled={loading}
            required
          />
          <button
            onClick={handleDelete}
            className="delete-btn"
            disabled={loading}
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default DeleteTask;