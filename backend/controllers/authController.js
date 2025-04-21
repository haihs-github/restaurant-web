const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.register = async (req, res) => {
	const { username, password, fullname, email, phone, role } = req.body;

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser)
			return res.status(400).json({ message: 'Tài khoản đã tồn tại' });

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			username,
			password: hashedPassword,
			fullname,
			email,
			phone,
			role,
		});

		res.status(201).json({ message: 'Tạo tài khoản thành công', userId: newUser._id });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi server', error: err.message });
	}
};


// Đăng nhập
exports.login = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (!user)
			return res.status(400).json({ message: 'Tài khoản không tồn tại' });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ message: 'Sai mật khẩu' });

		const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
			expiresIn: '1d',
		});

		res.json({ message: 'Đăng nhập thành công', token });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi server', error: err.message });
	}
};
