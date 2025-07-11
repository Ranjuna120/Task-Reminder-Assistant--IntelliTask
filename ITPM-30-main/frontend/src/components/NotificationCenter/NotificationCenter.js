import React, { useState } from 'react';
import useWebSocket from '../../hooks/useWebSocket';
import './NotificationCenter.css';

const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const userId = localStorage.getItem('userId');
    const {
        notifications,
        unreadCount,
        isConnected,
        connectionError,
        markNotificationAsRead,
        markAllAsRead,
        clearNotifications
    } = useWebSocket(userId);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markNotificationAsRead(notification.id);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const minutes = Math.floor((now - date) / (1000 * 60));
            return `${minutes}m ago`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'reminder':
                return '⏰';
            case 'task_update':
                return '📝';
            case 'broadcast':
                return '📢';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type, read) => {
        if (read) return 'read';
        
        switch (type) {
            case 'reminder':
                return 'reminder';
            case 'task_update':
                return 'update';
            case 'broadcast':
                return 'broadcast';
            default:
                return 'default';
        }
    };

    return (
        <div className="notification-center">
            <button 
                className={`notification-button ${unreadCount > 0 ? 'has-unread' : ''}`}
                onClick={togglePanel}
                aria-label={`Notifications (${unreadCount} unread)`}
            >
                <div className="notification-icon">
                    🔔
                    {unreadCount > 0 && (
                        <span className="notification-badge">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="notification-panel">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <div className="notification-actions">
                            <button 
                                className="action-button"
                                onClick={markAllAsRead}
                                disabled={unreadCount === 0}
                                title="Mark all as read"
                            >
                                ✓
                            </button>
                            <button 
                                className="action-button"
                                onClick={clearNotifications}
                                disabled={notifications.length === 0}
                                title="Clear all"
                            >
                                🗑️
                            </button>
                            <button 
                                className="action-button close-button"
                                onClick={togglePanel}
                                title="Close"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="connection-status">
                        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                            <span className="status-dot"></span>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </div>
                        {connectionError && (
                            <div className="connection-error">
                                {connectionError}
                            </div>
                        )}
                    </div>

                    <div className="notifications-list">
                        {notifications.length === 0 ? (
                            <div className="no-notifications">
                                <div className="no-notifications-icon">🔔</div>
                                <p>No notifications yet</p>
                                <small>You'll see task reminders and updates here</small>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${getNotificationColor(notification.type, notification.read)}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-content">
                                        <div className="notification-main">
                                            <span className="notification-type-icon">
                                                {getNotificationIcon(notification.type)}
                                            </span>
                                            <div className="notification-text">
                                                <div className="notification-title">
                                                    {notification.title || notification.task?.title || 'Task Update'}
                                                </div>
                                                {notification.message && (
                                                    <div className="notification-message">
                                                        {notification.message}
                                                    </div>
                                                )}
                                                {notification.task?.description && (
                                                    <div className="notification-description">
                                                        {notification.task.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="notification-meta">
                                            <span className="notification-time">
                                                {formatTime(notification.timestamp)}
                                            </span>
                                            {!notification.read && (
                                                <span className="unread-indicator"></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 10 && (
                        <div className="notification-footer">
                            <small>Showing latest {notifications.length} notifications</small>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
