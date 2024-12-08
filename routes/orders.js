const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrdersByArtist } = require('../controllers/orderController');

router.post('/create', createOrder);
router.get('/user/:userId', getUserOrders);
router.get('/artist/:artistId', getOrdersByArtist);
module.exports = router; 