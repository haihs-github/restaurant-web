const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');
const authMiddleware = require('../middlewares/authMiddleware');

//GET /api/tables/
//xem tat ca món
//public
router.get('/', dishController.getAllDishes);

//POST /api/tables/
//them 1 mon 
//private 
router.post('/', authMiddleware, dishController.createDish);

//PUT /api/tables/:id
//sua 1 mon 
//private 
router.put('/:id', authMiddleware, dishController.updateDish);

//DELETE /api/tables/
//xoa 1 mon 
//private 
router.delete('/:id', authMiddleware, dishController.deleteDish);

module.exports = router;
