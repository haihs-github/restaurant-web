const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Tạo đơn hàng mới (admin)
// POST /api/orders/
// private
router.post('/', authMiddleware, orderController.createOrder);

// Tạo đơn hàng mới (kh)
// POST /api/orders/
// public
router.post('/client', orderController.createOrderClient);

// Xem tất cả đơn hàng
// GET /api/orders/
router.get('/', authMiddleware, orderController.getAllOrders);

// xem chi tiết đơn hàng
// GET /api/orders/:orderId
// private
router.get('/:orderId', authMiddleware, orderController.getOrderDetail);


//cập nhật đơn hàng 
// PUT /api/orders/:orderId
// private

router.put('/:orderId', authMiddleware, orderController.updateOrder);

module.exports = router;
