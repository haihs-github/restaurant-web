const Dish = require('../models/Dish');
const Category = require("../models/Category");

// [GET] /api/dishes?page=1&limit=10 - lấy danh sách tất cả món ăn có phân trang 
exports.getAllDishes = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		// Lấy tổng số món ăn (không phân trang)
		const totalCount = await Dish.countDocuments({ deleted: false });

		const dishes = await Dish.find({ deleted: false })
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 })
			.populate('category_id', 'name'); // Chỉ lấy category.name

		const totalPage = Math.ceil(totalCount / limit);

		res.json({
			message: "Lấy danh sách món ăn thành công",
			dishes,
			totalPage
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Lỗi khi lấy danh sách món ăn' });
	}
};


// [POST] /api/dishes - thêm món ăn mới
exports.createDish = async (req, res) => {
	const { name, price, description, category, thumbnail } = req.body;
	try {

		const thumbnailpath = req.file?.path || thumbnail;

		if (!name || !price || !description || !category || !thumbnailpath) {
			return res.status(400).json({ message: "Thiếu thông tin tạo sản phẩm" })
		}

		const existingCategory = await Category.findOne({ name: category })
		console.log("existingCategory", existingCategory)

		let categoryId
		if (existingCategory) {
			categoryId = existingCategory._id;
			console.log("categoryId", categoryId)
		} else {
			const newCategory = new Category({ name: category });
			const savedCategory = await newCategory.save();
			categoryId = savedCategory._id;
		}

		const newDish = await Dish.create({
			name, price, description, category_id: categoryId, thumbnail: thumbnailpath
		})

		res.status(200).json({ message: "thêm món ăn thành công", dish: newDish })
	} catch (err) {
		res.status(500).json({ message: 'Thêm món ăn thất bại', err });
	}
};

// [PUT] /api/dishes/:id - cập nhật món ăn
exports.updateDish = async (req, res) => {
	const { name, price, description, category, thumbnail } = req.body;
	const dish_id = req.params.id;
	try {
		const thumbnailpath = req.file?.path || thumbnail;

		if (!name || !price || !description || !category || !thumbnailpath) {
			return res.status(400).json({ message: "Thiếu thông tin sửa sản phẩm" })
		}

		const existingCategory = await Category.findOne({ name: category })

		let categoryId
		if (existingCategory) {
			categoryId = existingCategory._id;
		} else {
			const newCategory = new Category({ name: category });
			const savedCategory = await newCategory.save();
			categoryId = savedCategory._id;
		}

		const updateDish = await Dish.findByIdAndUpdate(dish_id,
			{
				name,
				price,
				description,
				category_id: categoryId,
				thumbnail: thumbnailpath
			},
			{ new: true }
		)
		res.status(200).json({ message: "cập nhật món ăn thành công", updateDish })
	} catch (err) {
		res.status(400).json({ message: 'Cập nhật món ăn thất bại' });
	}
};

// [DELETE] /api/dishes/:id - xóa món ăn
exports.deleteDish = async (req, res) => {
	const dish_id = req.params.id;
	try {
		await Dish.findByIdAndUpdate(dish_id, { deleted: true }, { new: true }).select('-password');
		res.json({ message: 'Đã xóa món ăn' });
	} catch (err) {
		res.status(400).json({ message: 'Xóa món ăn thất bại' });
	}
};

