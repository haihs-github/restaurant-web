const User = require('../models/User');

// GET /api/users
const getAllUsers = async (req, res) => {
	try {
		if (req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Bạn không có quyền truy cập danh sách người dùng' });
		}
		const users = await User.find().select('-password');
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: err.message });
	}
};

// GET /api/users/:id
const getUserById = async (req, res) => {
	const { id } = req.params;
	try {
		if (req.user.role !== 'admin' && req.user.userId !== id) {
			return res.status(403).json({ message: 'Bạn không có quyền xem người dùng này' });
		}

		const user = await User.findById(id).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'Không tìm thấy người dùng' });
		}

		res.json(user);
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error: err.message });
	}
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
	const { id } = req.params;
	const { name, email, role } = req.body;

	try {
		if (req.user.role !== 'admin' && req.user.userId !== id) {
			return res.status(403).json({ message: 'Bạn không có quyền cập nhật người dùng này' });
		}

		const updateData = { name, email };
		if (req.user.role === 'admin' && role) updateData.role = role;
		if (req.user.role !== 'admin' && role) res.status(400).json({ message: 'bạn không thể tự thăng mình làm quản lý' });
		const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
		if (!updatedUser) {
			return res.status(404).json({ message: 'Không tìm thấy người dùng' });
		}

		res.json({ message: '✅ Cập nhật thành công', user: updatedUser });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error: err.message });
	}
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
	const { id } = req.params;
	try {
		if (req.user.role !== 'admin' && req.user.userId !== id) {
			return res.status(403).json({ message: 'Bạn không có quyền xóa người dùng này' });
		}

		const deleted = await User.findByIdAndDelete(id);
		if (!deleted) {
			return res.status(404).json({ message: 'Không tìm thấy người dùng' });
		}

		res.json({ message: '🗑️ Xóa người dùng thành công' });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi xóa người dùng', error: err.message });
	}
};

module.exports = {
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser
};
