const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const authMiddleware = require('../middlewares/authMiddleware');

// CRUD cho Table

//GET /api/tables/
//xem tat ca ban
//public
router.get('/', tableController.getAllTables);

//POST /api/tables/
//them 1 ban moi 
//private
router.post('/', authMiddleware, tableController.createTable);

//PUT /api/tables/:id
//sua 1 ban 
//private
router.put('/:id', authMiddleware, tableController.updateTable);

//DELETE /api/tables/:id
//xoa 1 ban 
//private
router.delete('/:id', authMiddleware, tableController.deleteTable);

module.exports = router;
