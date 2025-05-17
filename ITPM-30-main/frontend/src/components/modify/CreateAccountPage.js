import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './CreateAccountPage.css';

const CreateAccountPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/api/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Account Created Successfully!");
        navigate("/login");
      } else {
        setError(data.message || "Error creating account.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-card">
        <h2>Create Your Account</h2>
        <p className="subtitle">Join us today!</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }} className="create-account-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={name && name.length < 2 ? "invalid" : ""}
            />
            {name && name.length < 2 && (
              <span className="validation-message">Name must be at least 2 characters</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={email && !/^\S+@\S+\.\S+$/.test(email) ? "invalid" : ""}
            />
            {email && !/^\S+@\S+\.\S+$/.test(email) && (
              <span className="validation-message">Please enter a valid email</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={password && password.length < 6 ? "invalid" : ""}
            />
            {password && password.length < 6 && (
              <span className="validation-message">Password must be at least 6 characters</span>
            )}
          </div>
          <button 
            type="submit" 
            disabled={!name || !email || !password} 
            className="create-account-btn"
          >
            Create Account
          </button>
        </form>
        <div className="additional-actions">
          <p>Already have an account? <span onClick={() => navigate("/login")} className="login-link">Login</span></p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;