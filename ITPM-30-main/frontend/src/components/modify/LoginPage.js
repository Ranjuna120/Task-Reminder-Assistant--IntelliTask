import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        if (onLoginSuccess) onLoginSuccess(data.user);
        navigate("/tasks");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to continue</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="login-form">
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
          <button type="submit" disabled={!email || !password} className="login-btn">
            Login
          </button>
        </form>
        <div className="additional-actions">
          <button onClick={() => navigate("/create-account")} className="create-account-btn">
            Create Account
          </button>
          <button onClick={() => navigate("/admin-login")} className="admin-btn">
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;