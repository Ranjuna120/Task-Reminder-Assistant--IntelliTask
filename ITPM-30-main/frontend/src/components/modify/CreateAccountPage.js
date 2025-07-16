import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './CreateAccountPage.css';

const CreateAccountPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    if (password.length < 6) return 0;
    if (password.length < 8) return 1;
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])/.test(password)) return 2;
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 3;
    return 3;
  };

  const handleCreateAccount = async () => {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/auth/api/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Error creating account.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="create-account-container">
      <div className="create-account-card">
        <h2>Join IntelliTask</h2>
        <p className="subtitle">Create your account and start organizing</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }} className="create-account-form">
          <div className="input-group">
            <input
              id="name"
              type="text"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength="2"
            />
            <label htmlFor="name">Full Name</label>
          </div>

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
            
            {password && (
              <div className="password-strength">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className={`password-strength-bar ${
                      index < passwordStrength
                        ? passwordStrength === 1
                          ? 'weak'
                          : passwordStrength === 2
                          ? 'medium'
                          : 'strong'
                        : ''
                    } ${index < passwordStrength ? 'active' : ''}`}
                  />
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!name || !email || !password || loading} 
            className="create-account-btn"
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="additional-actions">
          <p>
            Already have an account? {' '}
            <span 
              onClick={() => !loading && navigate("/login")} 
              className="login-link"
              style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }}
            >
              Sign in here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;