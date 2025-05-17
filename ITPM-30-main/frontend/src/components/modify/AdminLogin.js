import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'; // Updated import path

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const manualLogin = (username, password) => {
        if (username === 'admin@gmail.com' && password === 'admin123') {
            return { success: true, role: 'admin' };
        } else if (username === 'category@gmail.com' && password === 'category123') {
            return { success: true, role: 'category' };
        } else {
            return { success: false, message: 'Invalid username or password' };
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const result = manualLogin(username, password);

        if (result.success) {
            if (result.role === 'admin') {
                navigate('/Feedbackmanage');
            } else if (result.role === 'category') {
                navigate('/categories');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <h2>Admin Login</h2>
                <p className="subtitle" >Access your admin dashboard</p>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={username && !username.includes('@') ? "invalid" : ""}
                        />
                        {username && !username.includes('@') && (
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
                    <button type="submit" disabled={!username || !password} className="login-btn">
                        Login
                    </button>
                </form>
                <div className="additional-actions">
                    <p >Regular user? <span onClick={() => navigate("/login")} className="user-login-link"><u>Login</u></span></p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;