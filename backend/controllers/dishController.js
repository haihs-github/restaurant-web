const Dish = require('../models/Dish');

// [GET] /api/dishes - lấy danh sách tất cả món ăn
const getAllDishes = async (req, res) => {
	try {
		const dishes = await Dish.find();
		res.json(dishes);
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy danh sách món ăn' });
	}
};

// [POST] /api/dishes - thêm món ăn mới
const createDish = async (req, res) => {
	const { name, price, description, category, isAvailable } = req.body;
	try {
		const newDish = new Dish({ name, price, description, category, isAvailable });
		const savedDish = await newDish.save();
		res.status(201).json(savedDish);
	} catch (err) {
		res.status(400).json({ message: 'Thêm món ăn thất bại' });
	}
};

// [PUT] /api/dishes/:id - cập nhật món ăn
const updateDish = async (req, res) => {
	try {
		const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.json(updatedDish);
	} catch (err) {
		res.status(400).json({ message: 'Cập nhật món ăn thất bại' });
	}
};

// [DELETE] /api/dishes/:id - xóa món ăn
const deleteDish = async (req, res) => {
	try {
		await Dish.findByIdAndDelete(req.params.id);
		res.json({ message: 'Đã xóa món ăn' });
	} catch (err) {
		res.status(400).json({ message: 'Xóa món ăn thất bại' });
	}
};

module.exports = {
	getAllDishes,
	createDish,
	updateDish,
	deleteDish
};
