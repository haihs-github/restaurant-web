const Category = require('../models/Category');
const Dish = require('../models/Dish');

// [GET] /api/categories - lấy danh sách tất cả danh mục, và xóa danh mục không dùng
exports.getAllCategories = async (req, res) => {
	try {
		const allCategories = await Category.find();

		for (const category of allCategories) {
			const dishCount = await Dish.countDocuments({ category_id: category._id, deleted: false });
			if (dishCount === 0) {
				await Category.findByIdAndDelete(category._id);
			}
		}

		// Sau khi xoá xong, lấy danh sách còn lại
		const remainingCategories = await Category.find();

		res.json({
			message: "Đã lọc và lấy danh sách danh mục thành công",
			categories: remainingCategories
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Lỗi khi xử lý danh sách danh mục' });
	}
};
