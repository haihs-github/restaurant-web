const User = require('../models/User');

// [GET] /api/users?page=1&limit=10 lấy toàn bộ user 
exports.getAllUsers = async (req, res) => {
	try {
		// phan trang
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const users = await User.find({ deleted: false }).select('-password')
		skip(skip).limit(limit).sort(username);
		const totalPage = Math.ceil(users.length / limit)

		res.status(200).json({ message: "lấy danh sách user thành công", users, totalPage });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: err.message });
	}
};

// [GET] /api/users/:id lấy chi tiết 1 người dùng
exports.getUserById = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'Không tìm thấy người dùng' });
		}

		res.status(200).json({ message: "lấy thông tin người dùng thành công", user });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error: err.message });
	}
};

// [PUT] /api/users/:id
exports.updateUser = async (req, res) => {
	const { id } = req.params;
	const { fullname, email, role, phone } = req.body;

	try {
		if (!fullname || !email || !role || !phone) {
			return res.status(200).json({ message: "thiếu thông tin khi sửa người dùng" })
		}
		const updatedUser = await User.findByIdAndUpdate(id,
			{ fullname, email, role, phone },
			{ new: true }).select('-password'
			);
		if (!updatedUser) {
			return res.status(404).json({ message: 'Không tìm thấy người dùng' });
		}

		res.json({ message: 'Cập nhật thành công', user: updatedUser });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error: err.message });
	}
};

// [DELETE] /api/users/:id
exports.deleteUser = async (req, res) => {
	const { id } = req.params;
	try {
		const deleted = await User.findByIdAndUpdate(id, { delete: true }, { new: true }).select('-password');
		if (!deleted) {
			return res.status(404).json({ message: 'Không tìm thấy người dùng' });
		}

		res.json({ message: 'Xóa người dùng thành công' });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi xóa người dùng', error: err.message });
	}
};

