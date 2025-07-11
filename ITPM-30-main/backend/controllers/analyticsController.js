const db = require('../db');

class AnalyticsController {
    // Get overall task statistics
    static getTaskStatistics(req, res) {
        const { userId } = req.params;
        
        const queries = {
            total: 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ?',
            completed: 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = "completed"',
            pending: 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = "pending"',
            overdue: `SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND due_date < NOW() AND status != "completed"`,
            todayDue: `SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND DATE(due_date) = CURDATE() AND status != "completed"`,
            thisWeekDue: `SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND WEEK(due_date) = WEEK(NOW()) AND YEAR(due_date) = YEAR(NOW()) AND status != "completed"`
        };
        
        const statistics = {};
        const queryPromises = Object.keys(queries).map(key => {
            return new Promise((resolve, reject) => {
                db.query(queries[key], [userId], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        statistics[key] = results[0].count;
                        resolve();
                    }
                });
            });
        });
        
        Promise.all(queryPromises)
            .then(() => {
                // Calculate completion rate
                statistics.completionRate = statistics.total > 0 
                    ? Math.round((statistics.completed / statistics.total) * 100) 
                    : 0;
                
                res.json(statistics);
            })
            .catch(error => {
                console.error('Error fetching task statistics:', error);
                res.status(500).json({ error: 'Failed to fetch task statistics' });
            });
    }
    
    // Get task completion trend (last 7 days)
    static getCompletionTrend(req, res) {
        const { userId } = req.params;
        
        const query = `
            SELECT 
                DATE(updated_at) as date,
                COUNT(*) as completed_tasks
            FROM tasks 
            WHERE user_id = ? 
                AND status = 'completed' 
                AND updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(updated_at)
            ORDER BY date ASC
        `;
        
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching completion trend:', err);
                return res.status(500).json({ error: 'Failed to fetch completion trend' });
            }
            
            // Fill in missing dates with 0 completed tasks
            const trend = [];
            const today = new Date();
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                
                const existing = results.find(r => r.date === dateStr);
                trend.push({
                    date: dateStr,
                    completed_tasks: existing ? existing.completed_tasks : 0
                });
            }
            
            res.json(trend);
        });
    }
    
    // Get tasks by category distribution
    static getCategoryDistribution(req, res) {
        const { userId } = req.params;
        
        const query = `
            SELECT 
                c.name as category_name,
                c.id as category_id,
                COUNT(t.id) as task_count,
                COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_count
            FROM categories c
            LEFT JOIN tasks t ON c.id = t.category_id AND t.user_id = ?
            GROUP BY c.id, c.name
            HAVING task_count > 0
            ORDER BY task_count DESC
        `;
        
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching category distribution:', err);
                return res.status(500).json({ error: 'Failed to fetch category distribution' });
            }
            
            res.json(results);
        });
    }
    
    // Get productivity insights
    static getProductivityInsights(req, res) {
        const { userId } = req.params;
        
        const queries = {
            // Most productive day of the week
            bestDay: `
                SELECT 
                    DAYNAME(updated_at) as day_name,
                    COUNT(*) as completed_tasks
                FROM tasks 
                WHERE user_id = ? AND status = 'completed' 
                GROUP BY DAYOFWEEK(updated_at), DAYNAME(updated_at)
                ORDER BY completed_tasks DESC
                LIMIT 1
            `,
            // Average tasks completed per day
            avgPerDay: `
                SELECT 
                    ROUND(COUNT(*) / COUNT(DISTINCT DATE(updated_at)), 1) as avg_tasks_per_day
                FROM tasks 
                WHERE user_id = ? AND status = 'completed' AND updated_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            `,
            // Current streak (consecutive days with completed tasks)
            currentStreak: `
                SELECT COUNT(*) as streak_days
                FROM (
                    SELECT DATE(updated_at) as completion_date
                    FROM tasks 
                    WHERE user_id = ? AND status = 'completed'
                    GROUP BY DATE(updated_at)
                    HAVING completion_date >= (
                        SELECT MIN(gap_date) 
                        FROM (
                            SELECT 
                                DATE(updated_at) as gap_date,
                                LAG(DATE(updated_at)) OVER (ORDER BY DATE(updated_at)) as prev_date
                            FROM tasks 
                            WHERE user_id = ? AND status = 'completed'
                            GROUP BY DATE(updated_at)
                            ORDER BY DATE(updated_at) DESC
                        ) gaps
                        WHERE DATEDIFF(gap_date, prev_date) > 1
                        LIMIT 1
                    )
                ) streak
            `
        };
        
        const insights = {};
        
        // Best day query
        db.query(queries.bestDay, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching best day:', err);
                return res.status(500).json({ error: 'Failed to fetch productivity insights' });
            }
            
            insights.bestDay = results[0] || { day_name: 'N/A', completed_tasks: 0 };
            
            // Average per day query
            db.query(queries.avgPerDay, [userId], (err, results) => {
                if (err) {
                    console.error('Error fetching average per day:', err);
                    return res.status(500).json({ error: 'Failed to fetch productivity insights' });
                }
                
                insights.avgTasksPerDay = results[0]?.avg_tasks_per_day || 0;
                
                // Simple streak calculation (last 7 days with tasks)
                const streakQuery = `
                    SELECT COUNT(DISTINCT DATE(updated_at)) as streak_days
                    FROM tasks 
                    WHERE user_id = ? 
                        AND status = 'completed' 
                        AND updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                `;
                
                db.query(streakQuery, [userId], (err, results) => {
                    if (err) {
                        console.error('Error fetching streak:', err);
                        return res.status(500).json({ error: 'Failed to fetch productivity insights' });
                    }
                    
                    insights.currentStreak = results[0]?.streak_days || 0;
                    res.json(insights);
                });
            });
        });
    }
    
    // Get upcoming deadlines
    static getUpcomingDeadlines(req, res) {
        const { userId } = req.params;
        
        const query = `
            SELECT 
                id,
                title,
                description,
                due_date,
                priority,
                DATEDIFF(due_date, NOW()) as days_until_due
            FROM tasks 
            WHERE user_id = ? 
                AND status != 'completed' 
                AND due_date >= NOW()
            ORDER BY due_date ASC
            LIMIT 10
        `;
        
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching upcoming deadlines:', err);
                return res.status(500).json({ error: 'Failed to fetch upcoming deadlines' });
            }
            
            res.json(results);
        });
    }
}

module.exports = AnalyticsController;
