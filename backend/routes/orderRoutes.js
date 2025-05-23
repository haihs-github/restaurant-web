const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Tạo đơn hàng mới (admin)
// POST /api/orders/
// private
router.post('/', orderController.createOrder);

// Xem tất cả đơn hàng
// GET /api/orders/
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);

// xem chi tiết đơn hàng
// GET /api/orders/:orderId
// private
router.get('/:orderId', verifyToken, isAdmin, orderController.getOrderDetail);


//cập nhật đơn hàng 
// PUT /api/orders/:orderId
// private

router.put('/:orderId', verifyToken, isAdmin, orderController.updateOrder);

//xoa đơn hàng 
// DELETE /api/orders/:orderId
// private
router.delete('/:orderId', verifyToken, isAdmin, orderController.deleteOrderById);

module.exports = router;
