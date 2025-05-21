const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');
const { verifyToken, isAdmin } = require('../middlewares/auth')
const upload = require('../middlewares/upload');
const { image } = require('../utils/cloudinary');


//GET /api/dishes/
//xem tat ca món
//public
router.get('', dishController.getAllDishes);

//POST /api/dishes/
//them 1 mon 
//private 
router.post('', verifyToken, isAdmin, upload.single('thumbnail'), dishController.createDish);

//PUT /api/dishes/:id
//sua 1 mon 
//private 
router.put('/:id', verifyToken, isAdmin, upload.single('thumbnail'), dishController.updateDish);

//DELETE /api/dishes/
//xoa 1 mon 
//private 
router.delete('/:id', verifyToken, isAdmin, dishController.deleteDish);

module.exports = router;
