const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// [POST] /api/auth/register - tạo tài khoản mới
exports.register = async (req, res) => {
	const { username, password, confirmPassword, fullname, email, phone, role } = req.body;

	try {
		const existingUser = await User.findOne({ username, deleted: false });
		if (existingUser)
			return res.status(400).json({ message: 'Tài khoản đã tồn tại' });

		if (password !== confirmPassword) {
			return res.status(400).json({ message: 'nhập lại mật khẩu không chính xác' })
		}

		// Regex kiểm tra email đúng định dạng
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		// Regex kiểm tra số điện thoại 10 chữ số
		const phoneRegex = /^\d{10}$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: 'Email không hợp lệ' });
		}

		// Kiểm tra số điện thoại
		if (!phoneRegex.test(phone)) {
			return res.status(400).json({ message: 'Số điện thoại phải gồm đúng 10 chữ số' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			username,
			password: hashedPassword,
			fullname,
			email,
			phone,
			role,
		});
		res.status(201).json({ message: 'Tạo tài khoản thành công', user: newUser });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi tạo tài khoản', error: err.message });
	}
};

// [POST] /api/auth/login - đăng nhập 
// Đăng nhập
exports.login = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username, deleted: false });
		if (!user)
			return res.status(400).json({ message: 'Tài khoản không tồn tại' });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ message: 'Sai mật khẩu' });

		// const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });

		const token = jwt.sign(
			{ userId: user._id, role: user.role, username: user.username },
			process.env.JWT_SECRET || "mysecretkey",
			{ expiresIn: "1d" }
		);

		res.json({ message: 'Đăng nhập thành công', token });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi đăng nhập', error: err.message });
	}
};
