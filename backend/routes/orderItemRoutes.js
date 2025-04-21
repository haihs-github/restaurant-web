const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/orders/:orderId/items 
// thêm món vào đơn
// private
router.post('/:orderId/items', authMiddleware, orderItemController.addItemToOrder);

// PUT /api/orders/:orderId/items/:itemId
// chinh sua món trong đơn
// private
router.put('/:orderId/items/:itemId', orderItemController.updateOrderItem);

// DELETE /api/orders/:orderId/items/:itemId
// xoa món trong đơn
// private
router.delete('/:orderId/items/:itemId', orderItemController.deleteOrderItem);

module.exports = router;
