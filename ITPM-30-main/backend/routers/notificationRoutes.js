const express = require('express');
const router = express.Router();

// Test notification endpoint
router.post('/test-notification', (req, res) => {
    const { userId, type, message } = req.body;
    const wsManager = req.app.get('wsManager');
    
    if (!wsManager) {
        return res.status(500).json({ error: 'WebSocket manager not available' });
    }
    
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Create test notification
    const testNotification = {
        id: Date.now(),
        type: type || 'test',
        title: 'Test Notification',
        message: message || 'This is a test notification from the server!',
        timestamp: new Date().toISOString(),
        read: false
    };
    
    // Send notification
    const sent = wsManager.sendNotificationToUser(userId, testNotification);
    
    if (sent) {
        res.json({ 
            success: true, 
            message: 'Test notification sent successfully',
            notification: testNotification
        });
    } else {
        res.status(404).json({ 
            error: 'User not connected or notification failed to send' 
        });
    }
});

// Broadcast test notification to all users
router.post('/broadcast-notification', (req, res) => {
    const { message, type } = req.body;
    const wsManager = req.app.get('wsManager');
    
    if (!wsManager) {
        return res.status(500).json({ error: 'WebSocket manager not available' });
    }
    
    const broadcastNotification = {
        id: Date.now(),
        type: type || 'broadcast',
        title: 'System Announcement',
        message: message || 'This is a system-wide announcement!',
        timestamp: new Date().toISOString(),
        read: false
    };
    
    wsManager.broadcastNotification(broadcastNotification);
    
    res.json({ 
        success: true, 
        message: 'Broadcast notification sent to all connected users',
        notification: broadcastNotification
    });
});

// Get WebSocket connection status
router.get('/websocket-status', (req, res) => {
    const wsManager = req.app.get('wsManager');
    
    if (!wsManager) {
        return res.status(500).json({ error: 'WebSocket manager not available' });
    }
    
    const connectedUsers = Array.from(wsManager.clients.keys());
    const connectionCount = wsManager.clients.size;
    
    res.json({
        connected: true,
        connectionCount,
        connectedUsers,
        serverTime: new Date().toISOString()
    });
});

module.exports = router;
