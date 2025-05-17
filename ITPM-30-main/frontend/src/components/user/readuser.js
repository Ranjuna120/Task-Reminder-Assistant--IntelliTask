import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDetail.css";

const UserDetail = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState({ username: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/api/user/${userId}`);
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error fetching user details");
      }
    };

    if (userId) fetchUserDetails();
  }, [userId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        const response = await fetch(`http://localhost:5000/auth/api/user/${userId}`, { 
          method: "DELETE" 
        });
        const data = await response.json();
        if (data.success) {
          alert(data.message);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/login");
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error deleting account");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/auth/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setIsEditing(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error updating user details");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <nav className="navbar">
          <button onClick={() => navigate(`/user/${userId}`)}>Profile</button>
          <button onClick={() => navigate(`/tasks`)}>Tasks</button>
          <button onClick={() => navigate("/Reminders")}>Reminders</button>
          <button onClick={() => navigate("/feedback")}>Feedback</button>
          <button onClick={() => navigate("/login")}>Logout</button>
        </nav>
        <h2 className="title">User Details</h2>
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="button-group">
            <button 
              className="action-button primary"
              onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
            <button 
              className="action-button delete"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetail;