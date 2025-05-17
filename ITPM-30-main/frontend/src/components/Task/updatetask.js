import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "./UpdateTask.css";

const UpdateTask = ({ taskId, onClose }) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Optionally fetch the current status of the task if needed
    const fetchTask = async () => {
      const response = await fetch(`http://localhost:5000/auth/api/tasks/${taskId}`);
      const data = await response.json();
      setStatus(data.status); // Set the current status
    };

    fetchTask();
  }, [taskId]);

  const handleUpdate = async () => {
    if (!status) {
      toast.error('Please select a status');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/auth/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast.success('Task updated successfully');
        onClose(); // Close the update form
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  return (
    <div className="update-task-container">
      <h2>Update Task Status</h2>
      <select value={status} onChange={(e) => setStatus(e.target.value)} required>
        <option value="">Select Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <div className="update-task-buttons">
        <button type="button" onClick={handleUpdate}>Update</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateTask;