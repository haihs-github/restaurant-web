const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authMiddleware = require('../middlewares/authMiddleware')
//POST /api/invoices/
// Tạo hóa đơn
// private 
router.post('/', authMiddleware, invoiceController.createInvoice);

//GET /api/invoices/
// xem danh sách toàn bộ hóa đơn
//private
router.get('/', authMiddleware, invoiceController.getAllInvoices);

//GET /api/invoices/table/:tableId
// xem theo hóa đơn theo ban 
//private
router.get('/table/:tableId', authMiddleware, invoiceController.getAllInvoices);

//GET /api/invoices/:invoiceId
// Xem chi tiết 1 hóa đơn
//private
router.get('/:invoiceId', authMiddleware, invoiceController.getInvoiceById); // Xem chi tiết 1 hóa đơn

//PUT /api/invoices/:invoiceId
// Sửa hóa đơn 
//private
router.put('/:invoiceId', authMiddleware, invoiceController.updateInvoice);

//PUT /api/invoices/:invoiceId
// Xóa hóa đơn 
//private 
router.delete('/:invoiceId', authMiddleware, invoiceController.deleteInvoice);


module.exports = router;
