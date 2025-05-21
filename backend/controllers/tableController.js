const Table = require('../models/Table');

// [GET] /api/tables?page=1&limit=10 Lấy danh sách tất cả bàn
exports.getAllTables = async (req, res) => {
	try {
		// phan trang
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const tables = await Table.find({ deleted: false })
			.skip(skip).limit(limit).sort({ tableNumber: -1 });

		const totalPage = Math.ceil(tables.length / limit)
		res.json({ message: "lay danh sach ban thanh cong", tables, totalPage });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy danh sách bàn' });
	}
};

// [POST] Thêm bàn mới
exports.createTable = async (req, res) => {
	const { tableNumber, capacity } = req.body;

	try {
		if (!tableNumber || !capacity) {
			return res.status(400).json({ message: "Thiếu thông tin khi tạo bàn" })
		}
		const existing = await Table.findOne({ tableNumber, deleted: false });
		console.log('existing', existing)
		if (existing) {
			return res.status(400).json({ message: 'Số bàn đã tồn tại' });
		}

		const newTable = new Table({ tableNumber, capacity });
		await newTable.save();

		res.status(200).json({ message: "tạo bàn thành công", newTable });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi thêm bàn', err });
	}
};

// [PUT] /api/tables/:id Cập nhật thông tin bàn
exports.updateTable = async (req, res) => {
	const { id } = req.params;
	const { tableNumber, capacity, status } = req.body;

	try {

		if (!tableNumber || !capacity || !status) {
			return res.status(400).json({ message: "Thiếu thông tin khi sửa bàn" })
		}

		const existing = await Table.findOne({ tableNumber, deleted: false });
		console.log('existing', existing)
		if (existing) {
			return res.status(400).json({ message: 'Số bàn đã tồn tại' });
		}

		const newTable = new Table({ tableNumber, capacity, status });

		const updatedTable = await Table.findByIdAndUpdate(id, newTable, { new: true });
		if (!updatedTable) {
			return res.status(404).json({ message: 'Không tìm thấy bàn' });
		}
		res.status(200).json({ message: "bàn đã cập nhật thành công", updatedTable });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi cập nhật bàn' });
	}
};

// [DELETE] Xóa bàn
exports.deleteTable = async (req, res) => {
	const { id } = req.params;

	try {
		const deleted = await Table.findByIdAndUpdate(id, { deleted: true }, { new: true }).select('-password');
		if (!deleted) {
			return res.status(404).json({ message: 'Không tìm thấy bàn' });
		}

		res.status(200).json({ message: 'Xóa bàn thành công' });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi xóa bàn' });
	}
};