import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));

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

        setLoading(false);
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <h2>Admin Portal</h2>
                <p className="subtitle">Secure access to your dashboard</p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="input-group">
                        <input
                            id="username"
                            type="email"
                            placeholder=" "
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label htmlFor="username">Email Address</label>
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
                        disabled={!username || !password || loading} 
                        className="login-btn"
                    >
                        {loading && <span className="loading-spinner"></span>}
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-links">
                    <p>
                        Regular user? {' '}
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;