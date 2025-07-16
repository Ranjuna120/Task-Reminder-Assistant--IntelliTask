import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to continue your journey</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="login-form">
          <div className="input-group">
            <input
              id="email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <div className="input-group">
            <input
              id="password"
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
            <label htmlFor="password">Password</label>
          </div>

          <button 
            type="submit" 
            disabled={!email || !password || loading} 
            className="login-btn"
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="additional-actions">
          <button 
            onClick={() => navigate("/create-account")} 
            className="create-account-btn"
            disabled={loading}
          >
            Create New Account
          </button>
          <button 
            onClick={() => navigate("/admin-login")} 
            className="admin-btn"
            disabled={loading}
          >
            Admin Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;