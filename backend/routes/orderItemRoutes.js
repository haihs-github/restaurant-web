const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// GET /api/orderItems/
// lấy danh sách tất cả món của đơn 
// private
router.get('/:orderId', verifyToken, orderItemController.getItemFromOrder);

// POST /api/orderItems 
// thêm món vào đơn
// private
router.post('/:orderId', verifyToken, orderItemController.addItemToOrder);

// PUT /api/orderItems/:itemId
// chinh sua món trong đơn
// private
router.put('/:id', verifyToken, orderItemController.updateOrderItem);

// DELETE /api/orderItems/:itemId
// xoa món trong đơn
// private
router.delete('/orderItems/:itemId', verifyToken, orderItemController.deleteOrderItem);

module.exports = router;
