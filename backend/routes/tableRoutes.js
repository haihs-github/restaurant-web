const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// CRUD cho Table

//GET /api/tables/
//xem tat ca ban
//public
router.get('', tableController.getAllTables);

//POST /api/tables/
//them 1 ban moi 
//private
router.post('', verifyToken, isAdmin, tableController.createTable);

//PUT /api/tables/:id
//sua 1 ban 
//private
router.put('/:id', verifyToken, isAdmin, tableController.updateTable);

//GET /api/tables/:id
//xem ban theo id
//private
router.get('/:id', tableController.getTableById);

//DELETE /api/tables/:id
//xoa 1 ban 
//private
router.delete('/:id', verifyToken, isAdmin, tableController.deleteTable);

module.exports = router;
