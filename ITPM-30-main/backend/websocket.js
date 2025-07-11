const WebSocket = require('ws');

class WebSocketManager {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Map(); // userId -> websocket connection
        
        this.wss.on('connection', (ws, req) => {
            console.log('New WebSocket connection established');
            
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleMessage(ws, data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            });
            
            ws.on('close', () => {
                // Remove client from map when connection closes
                for (const [userId, client] of this.clients.entries()) {
                    if (client === ws) {
                        this.clients.delete(userId);
                        console.log(`User ${userId} disconnected`);
                        break;
                    }
                }
            });
            
            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        });
    }
    
    handleMessage(ws, data) {
        switch (data.type) {
            case 'authenticate':
                this.authenticateUser(ws, data.userId);
                break;
            case 'ping':
                ws.send(JSON.stringify({ type: 'pong' }));
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    }
    
    authenticateUser(ws, userId) {
        if (userId) {
            this.clients.set(userId, ws);
            ws.send(JSON.stringify({ 
                type: 'authenticated', 
                message: 'Successfully connected to real-time notifications' 
            }));
            console.log(`User ${userId} authenticated`);
        }
    }
    
    // Send notification to specific user
    sendNotificationToUser(userId, notification) {
        const client = this.clients.get(userId);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'notification',
                data: notification
            }));
            return true;
        }
        return false;
    }
    
    // Send notification to all connected users
    broadcastNotification(notification) {
        this.clients.forEach((client, userId) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'broadcast',
                    data: notification
                }));
            }
        });
    }
    
    // Send task update notification
    sendTaskUpdate(userId, task, action) {
        const notification = {
            id: Date.now(),
            type: 'task_update',
            action: action, // 'created', 'updated', 'deleted', 'reminder'
            task: task,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        return this.sendNotificationToUser(userId, notification);
    }
    
    // Send reminder notification
    sendReminder(userId, task) {
        const notification = {
            id: Date.now(),
            type: 'reminder',
            title: `Reminder: ${task.title}`,
            message: task.description || 'Task reminder',
            task: task,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        return this.sendNotificationToUser(userId, notification);
    }
}

module.exports = WebSocketManager;
