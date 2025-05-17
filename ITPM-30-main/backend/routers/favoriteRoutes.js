const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

router.post('/favorites', favoriteController.addFavorite);
router.get('/favorites/:userId', favoriteController.getFavorites);
router.delete('/favorites', favoriteController.removeFavorite);
router.put('/favorites', favoriteController.updateFavorite);

module.exports = router;