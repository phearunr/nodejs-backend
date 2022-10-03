const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const AuthCheck = require('../middleware/check-auth');
const orderController = require('../controllers/Orders');

route.get('/', AuthCheck ,orderController.orders_get_all); 
route.post('/', orderController.orders_create_order);
route.get('/:orderId', orderController.orders_findById); 
route.patch('/:orderId', orderController.orders_patch);
route.delete('/:orderId', orderController.orders_delete);

module.exports = route;