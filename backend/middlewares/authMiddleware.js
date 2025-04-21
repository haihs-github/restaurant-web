const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
	// Lấy token từ header: Authorization: Bearer <token>
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Chưa đăng nhập hoặc thiếu token' });
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // Gắn thông tin người dùng vào req để dùng sau
		next(); // Cho phép truy cập tiếp
	} catch (err) {
		return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
	}
};

module.exports = authMiddleware;
