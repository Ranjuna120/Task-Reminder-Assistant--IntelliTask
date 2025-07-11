import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = () => {
    const [statistics, setStatistics] = useState({});
    const [trend, setTrend] = useState([]);
    const [categoryDistribution, setCategoryDistribution] = useState([]);
    const [insights, setInsights] = useState({});
    const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const baseUrl = 'http://localhost:5000/auth/api';
            
            const [statsRes, trendRes, categoriesRes, insightsRes, deadlinesRes] = await Promise.all([
                fetch(`${baseUrl}/analytics/statistics/${userId}`),
                fetch(`${baseUrl}/analytics/trend/${userId}`),
                fetch(`${baseUrl}/analytics/categories/${userId}`),
                fetch(`${baseUrl}/analytics/insights/${userId}`),
                fetch(`${baseUrl}/analytics/deadlines/${userId}`)
            ]);

            const statsData = await statsRes.json();
            const trendData = await trendRes.json();
            const categoriesData = await categoriesRes.json();
            const insightsData = await insightsRes.json();
            const deadlinesData = await deadlinesRes.json();

            setStatistics(statsData);
            setTrend(trendData);
            setCategoryDistribution(categoriesData);
            setInsights(insightsData);
            setUpcomingDeadlines(deadlinesData);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, subtitle, color }) => (
        <div className={`stat-card ${color}`}>
            <div className="stat-header">
                <h3>{title}</h3>
            </div>
            <div className="stat-value">{value}</div>
            {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        </div>
    );

    const TrendChart = ({ data }) => {
        const maxValue = Math.max(...data.map(d => d.completed_tasks), 1);
        
        return (
            <div className="trend-chart">
                <h3>7-Day Completion Trend</h3>
                <div className="chart-container">
                    {data.map((item, index) => (
                        <div key={index} className="chart-bar">
                            <div 
                                className="bar" 
                                style={{ height: `${(item.completed_tasks / maxValue) * 100}%` }}
                            ></div>
                            <div className="bar-label">
                                {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="bar-value">{item.completed_tasks}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const CategoryChart = ({ data }) => {
        const total = data.reduce((sum, item) => sum + item.task_count, 0);
        
        return (
            <div className="category-chart">
                <h3>Tasks by Category</h3>
                <div className="category-list">
                    {data.map((category, index) => (
                        <div key={index} className="category-item">
                            <div className="category-info">
                                <span className="category-name">{category.category_name}</span>
                                <span className="category-count">{category.task_count} tasks</span>
                            </div>
                            <div className="category-progress">
                                <div 
                                    className="progress-bar" 
                                    style={{ width: `${(category.task_count / total) * 100}%` }}
                                ></div>
                            </div>
                            <div className="completion-rate">
                                {Math.round((category.completed_count / category.task_count) * 100)}% completed
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="analytics-container">
                <div className="loading">Loading analytics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analytics-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <h1>📊 Task Analytics Dashboard</h1>
                <p>Get insights into your productivity and task management</p>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <StatCard 
                    title="Total Tasks" 
                    value={statistics.total || 0} 
                    color="blue"
                />
                <StatCard 
                    title="Completed" 
                    value={statistics.completed || 0} 
                    subtitle={`${statistics.completionRate || 0}% completion rate`}
                    color="green"
                />
                <StatCard 
                    title="Pending" 
                    value={statistics.pending || 0} 
                    color="orange"
                />
                <StatCard 
                    title="Overdue" 
                    value={statistics.overdue || 0} 
                    color="red"
                />
                <StatCard 
                    title="Due Today" 
                    value={statistics.todayDue || 0} 
                    color="purple"
                />
                <StatCard 
                    title="Due This Week" 
                    value={statistics.thisWeekDue || 0} 
                    color="teal"
                />
            </div>

            {/* Charts and Insights */}
            <div className="charts-grid">
                <div className="chart-card">
                    <TrendChart data={trend} />
                </div>

                <div className="chart-card">
                    <CategoryChart data={categoryDistribution} />
                </div>
            </div>

            {/* Productivity Insights */}
            <div className="insights-section">
                <h3>🎯 Productivity Insights</h3>
                <div className="insights-grid">
                    <div className="insight-card">
                        <div className="insight-icon">📅</div>
                        <div className="insight-content">
                            <h4>Most Productive Day</h4>
                            <p>{insights.bestDay?.day_name || 'N/A'}</p>
                            <small>{insights.bestDay?.completed_tasks || 0} tasks completed</small>
                        </div>
                    </div>
                    
                    <div className="insight-card">
                        <div className="insight-icon">📈</div>
                        <div className="insight-content">
                            <h4>Daily Average</h4>
                            <p>{insights.avgTasksPerDay || 0} tasks/day</p>
                            <small>Last 30 days</small>
                        </div>
                    </div>
                    
                    <div className="insight-card">
                        <div className="insight-icon">🔥</div>
                        <div className="insight-content">
                            <h4>Current Streak</h4>
                            <p>{insights.currentStreak || 0} days</p>
                            <small>With completed tasks</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="deadlines-section">
                <h3>⏰ Upcoming Deadlines</h3>
                <div className="deadlines-list">
                    {upcomingDeadlines.length > 0 ? (
                        upcomingDeadlines.map((task, index) => (
                            <div key={index} className={`deadline-item priority-${task.priority}`}>
                                <div className="deadline-info">
                                    <h4>{task.title}</h4>
                                    <p>{task.description}</p>
                                </div>
                                <div className="deadline-time">
                                    <div className="days-left">
                                        {task.days_until_due === 0 ? 'Due Today' : 
                                         task.days_until_due === 1 ? 'Due Tomorrow' :
                                         `${task.days_until_due} days left`}
                                    </div>
                                    <div className="due-date">
                                        {new Date(task.due_date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-deadlines">
                            <p>🎉 No upcoming deadlines!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
