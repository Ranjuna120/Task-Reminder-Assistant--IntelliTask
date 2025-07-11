import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import TaskList from "./components/Task/TaskList";
import AddTask from "./components/Task/AddTask";
import LoginPage from "./components/modify/LoginPage";
import CreateAccountPage from "./components/modify/CreateAccountPage";
import UserDetail from "./components/user/readuser";
import AdminLogin from "./components/modify/AdminLogin";
import Category from "./components/category/category";
import FeedbackPage from "./components/FeedBack/FeedbackForm";
import Feedbackmanage from "./components/FeedBack/feedbackmange";
import Reminders from "./components/Task/reminders";
import Favourites from "./components/Favourite/FavoriteTasks";
import Analytics from "./components/Analytics/Analytics";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    const timer = setTimeout(() => setIsLoading(false), 4000); // 4 seconds to match animation duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          {isLoading ? (
            <SplashScreen />
          ) : (
            <>
              <AppHeader />
              <main className="app-main">
                <Routes>
                  <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                  <Route path="/create-account" element={<CreateAccountPage />} />
                  <Route path="/user/:id" element={<UserDetail />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                  <Route path="/favourites" element={<Favourites />} />
                  <Route path="/categories" element={<Category />} />
                  <Route path="/Reminders" element={<Reminders />} />
                  <Route path="/Feedbackmanage" element={<Feedbackmanage />} />
                  <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} />
                  <Route
                    path="/tasks"
                    element={
                      isAuthenticated ? <TaskListPage onLogout={handleLogout} /> : <Navigate to="/login" />
                    }
                  />
                  <Route path="*" element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} />} />
                </Routes>
              </main>
            </>
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

// Splash Screen Component with Clock and Floating Clouds
const SplashScreen = () => (
  <div className="splash-screen">
    {/* Cloud Elements */}
    <div className="cloud cloud-1"></div>
    <div className="cloud cloud-2"></div>
    <div className="cloud cloud-3"></div>
    <div className="splash-content">
      {/* Clock SVG with Ticking Animation */}
      <svg className="clock" width="200" height="200" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="2" />
        {/* Hour Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="35"
          stroke="#fff"
          strokeWidth="2"
          className="clock-hand hour-hand"
        />
        {/* Minute Hand */}
        <line
          x1="50"
          y1="50"
          x2="65"
          y2="50"
          stroke="#fff"
          strokeWidth="2"
          className="clock-hand minute-hand"
        />
        {/* Second Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="25"
          stroke="#ff6f61"
          strokeWidth="1"
          className="clock-hand second-hand"
        />
        <circle cx="50" cy="50" r="2" fill="#fff" />
      </svg>
      {/* Animated Title */}
      <svg className="title-svg" width="300" height="60" viewBox="0 0 300 60">
        <text x="50%" y="50%" textAnchor="middle" dy=".35em" className="title-text">
          IntelliTask
        </text>
      </svg>
      <p className="splash-subtitle">Your Task & Reminder Assistant</p>
    </div>
  </div>
);

// Header Component
const AppHeader = () => {
  const ThemeToggle = React.lazy(() => import('./components/ThemeToggle/ThemeToggle'));
  const NotificationCenter = React.lazy(() => import('./components/NotificationCenter/NotificationCenter'));
  
  return (
    <header className="app-header">
      <h1>IntelliTask: Task & Reminder Assistant</h1>
      <div className="header-controls">
        <React.Suspense fallback={<div>Loading...</div>}>
          <NotificationCenter />
          <ThemeToggle />
        </React.Suspense>
      </div>
    </header>
  );
};

// TaskListPage Component
const TaskListPage = ({ onLogout }) => {
  const userId = localStorage.getItem("userId");

  return (
    <div className="task-list-page">
      <Navbar onLogout={onLogout} userId={userId} />
      <TaskList />
      <AddTask />
    </div>
  );
};

// Navbar Component
const Navbar = ({ onLogout, userId }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <button className="nav-btn profile-btn" onClick={() => navigate(`/user/${userId}`)}>
        👤 User Profile
      </button>
      <button className="nav-btn analytics-btn" onClick={() => navigate("/analytics")}>
        📊 Analytics
      </button>
      <button className="nav-btn reminders-btn" onClick={() => navigate("/Reminders")}>
        ⏰ Reminders
      </button>
      <button className="nav-btn feedback-btn" onClick={() => navigate("/feedback")}>
        💬 Feedback
      </button>
      <button className="nav-btn favourites-btn" onClick={() => navigate("/favourites")}>
        ⭐ Favourites
      </button>
      <button className="nav-btn logout-btn" onClick={onLogout}>
        🚪 Logout
      </button>
    </nav>
  );
};

export default App;