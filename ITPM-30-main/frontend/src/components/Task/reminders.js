import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Reminders.css";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); // Adjust based on your auth setup
        const response = await fetch("http://localhost:5000/auth/api/reminders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        if (!response.ok) throw new Error(`Failed to fetch reminders: ${response.statusText}`);
        const data = await response.json();
        setReminders(data);
      } catch (err) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reminders List", 14, 16);
    const tableColumn = ["Task", "Reminder Time", "Status", "User"];
    const tableRows = reminders.map((reminder) => [
      reminder.task_title,
      new Date(reminder.reminder_time).toLocaleString(),
      reminder.status,
      reminder.username,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10, cellPadding: 5 },
      theme: "grid",
    });
    doc.save("reminders.pdf");
    toast.success("PDF generated successfully!");
  };

  const deleteReminder = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/auth/api/reminders/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (!response.ok) throw new Error("Failed to delete reminder");
      setReminders(reminders.filter((reminder) => reminder.id !== id));
      toast.success("Reminder deleted successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  const Navbar = () => (
    <nav className="navbar">
      <button onClick={() => navigate(`/user/${userId}`)} aria-label="Go to User Profile">
        User Profile
      </button>
      <button onClick={() => navigate("/tasks")} aria-label="Go to User Tasks">
        User Tasks
      </button>
      <button onClick={() => navigate("/Reminders")} aria-label="Go to Reminders" disabled>
        Reminders
      </button>
      <button onClick={() => navigate("/feedback")} aria-label="Go to Feedback">
        Feedback
      </button>
      <button onClick={() => navigate("/login")} aria-label="Logout">
        Logout
      </button>
    </nav>
  );

  const ReminderItem = ({ reminder }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTime, setEditedTime] = useState(reminder.reminder_time);

    const handleUpdate = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/auth/api/reminders/${reminder.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ reminder_time: editedTime }),
        });
        if (!response.ok) throw new Error("Failed to update reminder");
        const updatedReminder = await response.json();
        setReminders((prev) =>
          prev.map((r) => (r.id === reminder.id ? updatedReminder : r))
        );
        setIsEditing(false);
        toast.success("Reminder updated successfully!");
      } catch (err) {
        toast.error(`Update failed: ${err.message}`);
      }
    };

    return (
      <li className="reminder-item" role="listitem">
        <div className="reminder-details">
          <strong>Task:</strong> {reminder.task_title} <br />
          {isEditing ? (
            <input
              type="datetime-local"
              value={new Date(editedTime).toISOString().slice(0, -8)}
              onChange={(e) => setEditedTime(new Date(e.target.value).toISOString())}
              className="edit-input"
              aria-label="Edit reminder time"
            />
          ) : (
            <>
              <strong>Reminder Time:</strong>{" "}
              {new Date(reminder.reminder_time).toLocaleString()} <br />
            </>
          )}
          <strong>Status:</strong> {reminder.status} <br />
          <strong>User:</strong> {reminder.username} <br />
        </div>
        <div className="reminder-actions">
          {isEditing ? (
            <>
              <button onClick={handleUpdate} className="save-btn" aria-label="Save changes">
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="cancel-btn"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="edit-btn"
              aria-label={`Edit reminder for ${reminder.task_title}`}
            >
              Edit
            </button>
          )}
          <button
            onClick={() => deleteReminder(reminder.id)}
            className="delete-btn"
            aria-label={`Delete reminder for ${reminder.task_title}`}
          >
            Delete
          </button>
        </div>
      </li>
    );
  };

  return (
    <div className="reminders-container">
      <Navbar />
      <h1>Reminders</h1>
      {loading && <div className="loader">Loading reminders...</div>}
      {error && (
        <div className="error-msg">
          {error}
          <br />
          <small>Check the server status or console for details.</small>
        </div>
      )}
      {!loading && !error && (
        <>
          <button onClick={generatePDF} className="pdf-button" aria-label="Generate PDF">
            Generate PDF
          </button>
          {reminders.length === 0 ? (
            <div className="no-reminders">No reminders found.</div>
          ) : (
            <ul className="reminders-list" role="list">
              {reminders.map((reminder) => (
                <ReminderItem key={reminder.id} reminder={reminder} />
              ))}
            </ul>
          )}
        </>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Reminders;