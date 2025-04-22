const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

//GET api/users
//lay danh sach nhan vien
//private
router.get('/', verifyToken, userController.getAllUsers);

//GET api/users/:id
//xem chi tiet nhan vien
//private
router.get('/:id', verifyToken, userController.getUserById);

//PUT api/users/:id
//chinh sua thong tin
//private
router.put('/:id', verifyToken, userController.updateUser);

//DELETE api/users/:id
//xoa nhan vien
//private
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;
