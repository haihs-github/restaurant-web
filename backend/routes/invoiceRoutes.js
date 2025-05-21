const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { verifyToken, isAdmin } = require('../middlewares/auth')
//POST /api/invoices/
// Tạo hóa đơn
// private 
router.post('', verifyToken, isAdmin, invoiceController.createInvoice);

//GET /api/invoices/
// xem danh sách toàn bộ hóa đơn
//private
router.get('', verifyToken, invoiceController.getAllInvoices);

//GET /api/invoices/table/:tableId
// xem theo hóa đơn theo ban 
//private
router.get('/table/:tableId', verifyToken, invoiceController.getInvoicesByTable);

//GET /api/invoices/:invoiceId
// Xem chi tiết 1 hóa đơn
//private
router.get('/:invoiceId', verifyToken, invoiceController.getInvoiceById); // Xem chi tiết 1 hóa đơn

//PUT /api/invoices/:invoiceId
// Sửa hóa đơn 
//private
router.put('/:invoiceId', verifyToken, invoiceController.updateInvoice);

//PUT /api/invoices/:invoiceId
// Xóa hóa đơn 
//private 
router.delete('/:invoiceId', verifyToken, isAdmin, invoiceController.deleteInvoice);


module.exports = router;
