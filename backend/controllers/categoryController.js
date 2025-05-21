const Category = require('../models/Category')

// [GET] /api/categories - lấy danh sách tất cả doanh muc
exports.getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find();
		res.json({ message: "lấy danh sách món ăn thành công", categories });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy danh sách món ăn' });
	}
};