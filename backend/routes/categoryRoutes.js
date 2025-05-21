const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController')

//GET /api/auth/register
//lay danh sach don hang 
//private
router.get('', categoryController.getAllCategories);

module.exports = router;