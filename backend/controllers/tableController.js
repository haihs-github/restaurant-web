const Table = require('../models/Table');

// [GET] Lấy danh sách tất cả bàn
const getAllTables = async (req, res) => {
	try {
		const tables = await Table.find();
		res.json(tables);
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy danh sách bàn' });
	}
};

// [POST] Thêm bàn mới
const createTable = async (req, res) => {
	const { tableNumber, capacity, status } = req.body;

	try {
		const existing = await Table.findOne({ tableNumber });
		console.log('existing', existing)
		if (existing && existing.isAvailable) {
			return res.status(400).json({ message: 'Số bàn đã tồn tại' });
		}

		const newTable = new Table({ tableNumber, capacity, status });
		console.log('new table', newTable)
		await newTable.save();

		res.status(201).json(newTable);
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi thêm bàn', err });
	}
};

// [PUT] Cập nhật thông tin bàn
const updateTable = async (req, res) => {
	const { id } = req.params;

	try {
		const check = await Table.findById(id);
		console.log('check', check)
		const existing = await Table.findOne({ tableNumber: check.tableNumber, isAvailable: true })
		if (existing && existing.isAvailable) {
			return res.status(400).json({ message: 'Số bàn đã tồn tại' });
		}
		const updatedTable = await Table.findByIdAndUpdate(id, req.body, { new: true });
		if (!updatedTable) {
			return res.status(404).json({ message: 'Không tìm thấy bàn' });
		}

		res.json(updatedTable);
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi cập nhật bàn' });
	}
};

// [DELETE] Xóa bàn
const deleteTable = async (req, res) => {
	const { id } = req.params;

	try {
		const deleted = await Table.findByIdAndUpdate(id, { isAvailable: false }, { new: true }).select('-password');
		if (!deleted) {
			return res.status(404).json({ message: 'Không tìm thấy bàn' });
		}

		res.json({ message: 'Xóa bàn thành công' });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi xóa bàn' });
	}
};

module.exports = {
	getAllTables,
	createTable,
	updateTable,
	deleteTable,
};
