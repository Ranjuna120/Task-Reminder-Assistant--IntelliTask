import { useState, useEffect, useRef, useCallback } from 'react';

const useWebSocket = (userId) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 5;

    const connect = useCallback(() => {
        if (!userId) return;

        try {
            const ws = new WebSocket('ws://localhost:5000');
            
            ws.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);
                setConnectionError(null);
                reconnectAttemptsRef.current = 0;
                
                // Authenticate user
                ws.send(JSON.stringify({
                    type: 'authenticate',
                    userId: userId
                }));
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleWebSocketMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onclose = (event) => {
                console.log('WebSocket disconnected:', event.code, event.reason);
                setIsConnected(false);
                setSocket(null);
                
                // Attempt to reconnect if not intentionally closed
                if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
                    const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
                    console.log(`Reconnecting in ${timeout}ms... (attempt ${reconnectAttemptsRef.current + 1})`);
                    
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectAttemptsRef.current++;
                        connect();
                    }, timeout);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionError('Connection failed');
            };

            setSocket(ws);
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            setConnectionError('Failed to connect');
        }
    }, [userId]);

    const handleWebSocketMessage = (data) => {
        switch (data.type) {
            case 'authenticated':
                console.log('WebSocket authenticated:', data.message);
                break;
                
            case 'notification':
            case 'broadcast':
                addNotification(data.data);
                break;
                
            case 'pong':
                // Handle ping/pong for connection health
                break;
                
            default:
                console.log('Unknown WebSocket message type:', data.type);
        }
    };

    const addNotification = (notification) => {
        setNotifications(prev => {
            const newNotifications = [notification, ...prev];
            // Keep only last 50 notifications
            return newNotifications.slice(0, 50);
        });
        
        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title || 'Task Reminder', {
                body: notification.message || notification.task?.title,
                icon: '/favicon.ico',
                tag: `task-${notification.id}`,
                requireInteraction: false
            });
        }
    };

    const sendMessage = useCallback((message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
            return true;
        }
        return false;
    }, [socket]);

    const markNotificationAsRead = useCallback((notificationId) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, read: true }
                    : notification
            )
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, read: true }))
        );
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const requestNotificationPermission = useCallback(async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }, []);

    // Connect when component mounts or userId changes
    useEffect(() => {
        connect();

        // Request notification permission
        requestNotificationPermission();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socket) {
                socket.close(1000, 'Component unmounting');
            }
        };
    }, [connect]);

    // Ping server periodically to keep connection alive
    useEffect(() => {
        if (!isConnected || !socket) return;

        const pingInterval = setInterval(() => {
            sendMessage({ type: 'ping' });
        }, 30000); // Ping every 30 seconds

        return () => clearInterval(pingInterval);
    }, [isConnected, socket, sendMessage]);

    return {
        socket,
        isConnected,
        connectionError,
        notifications,
        unreadCount: notifications.filter(n => !n.read).length,
        sendMessage,
        markNotificationAsRead,
        markAllAsRead,
        clearNotifications,
        requestNotificationPermission,
        reconnect: connect
    };
};

export default useWebSocket;
