
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');



// Create Account route
router.post("/create-account", UserController.createAccount);

// Login route
router.post('/login', UserController.login);

// Get User Details route
router.get('/user/:id', UserController.getUserDetails);

// Update User route
router.put('/user/:id', UserController.updateUser );

// Delete User route
router.delete('/user/:id', UserController.deleteUser );

module.exports = router;