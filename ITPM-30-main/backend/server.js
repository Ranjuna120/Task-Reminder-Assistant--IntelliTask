const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routers/taskRoutes');
const userRoutes = require('./routers/userRoutes');
const categoryRoutes = require('./routers/categoryRoutes');
const FeedbackRoutes =require('./routers/feedbackRoutes');
const reminderController = require('./routers/remainderrouter'); // Assuming you have this file
const favoriteRoutes = require('./routers/favoriteRoutes');



const app = express();
const port = 5000;


// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.use('/auth/api', taskRoutes);
app.use('/auth/api', userRoutes);
app.use('/auth/api/category', categoryRoutes);
app.use('/auth/api', FeedbackRoutes);
app.use('/auth/api', reminderController); // Add this line to use the reminder controller
app.use('/auth/api', favoriteRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
