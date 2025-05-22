const Order = require('../models/Order');
const User = require('../models/User');
const Table = require('../models/Table');

//[POST] /api/orders/ Tạo đơn đặt bàn mới ( admin)
exports.createOrder = async (req, res) => {
	try {
		const { table_id, customerName, customerPhone, emailCustomer } = req.body;
		const user_id = req.user?.userId || null; // nếu có middleware xác thực

		if (!table_id || !customerName || !customerPhone || !emailCustomer) {
			return res.status(400).json({ message: "Thiếu dữ liệu khi tạo đơn đặt bàn" });
		}

		// Kiểm tra bàn
		const table = await Table.findById(table_id);
		if (!table) {
			return res.status(404).json({ message: "Không tìm thấy bàn" });
		}
		if (table.status === 'booked') {
			return res.status(400).json({ message: "Bàn này đã được đặt rồi" });
		}

		// Tạo đơn đặt bàn
		const newOrder = await Order.create({
			table_id,
			user_id,
			customerName,
			customerPhone,
			emailCustomer,
			status: 'pending',
			orderedAt: new Date()
		});

		// Cập nhật trạng thái bàn
		table.status = 'booked';
		await table.save();

		res.status(200).json({
			message: "Tạo đơn đặt bàn thành công",
			order: newOrder,
		});
	} catch (err) {
		console.error("Lỗi khi tạo đơn đặt bàn:", err);
		res.status(500).json({ message: 'Lỗi khi tạo đơn đặt bàn', error: err.message });
	}
};


//[GET] api/orders?page=1&limit=10 Xem danh sách đơn đặt bàn
exports.getAllOrders = async (req, res) => {
	try {
		// Phân trang
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		// Đếm tổng số đơn hàng (sau khi lọc deleted: false)
		const totalOrders = await Order.countDocuments({ deleted: false });

		// Lấy danh sách đơn hàng kèm populate tableNumber
		const orders = await Order.find({ deleted: false })
			.populate('table_id', 'tableNumber') // Chỉ lấy tableNumber từ bảng Table
			.populate('user_id', 'username')
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 });

		const totalPage = Math.ceil(totalOrders / limit);

		res.status(200).json({
			message: "Lấy danh sách đơn đặt bàn thành công",
			orders,
			totalPage
		});
	} catch (err) {
		res.status(500).json({
			message: 'Lỗi khi lấy danh sách đơn đặt bàn',
			error: err.message
		});
	}
};

//[GET] api/orders/:orderId xem chi tiết đơn đặt bàn 
exports.getOrderDetail = async (req, res) => {
	try {
		const { orderId } = req.params;

		// Lấy thông tin đơn đặt bàn + danh sách các món trong đơn
		const order = await Order.findById(orderId).populate({
			path: 'orderItems',
			populate: {
				path: 'dish_id',
				select: 'name price description', // Lấy thông tin món ăn
			},
		});

		if (!order) {
			return res.status(404).json({ message: 'Không tìm thấy đơn đặt bàn' });
		}

		res.status(200).json({ message: "Lấy chi tiết đơn thành công", order });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn đặt bàn', error: err.message });
	}
};

//[PUT] /api/orders/:orderId update đơn đặt bàn 
exports.updateOrder = async (req, res) => {
	const user_id = req.user.userId; // lấy từ token

	try {
		const { orderId } = req.params;
		const { table_id,
			status,
			orderedAt,
			customerName,
			customerPhone,
			emailCustomer } = req.body;

		// Kiểm tra trạng thái hợp lệ
		const validStatuses = ['pending', 'confirmed', 'served', 'completed', 'rejected'];
		if (status && !validStatuses.includes(status)) {
			return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
		}

		if (!orderId || !status || !orderedAt || !customerName || !customerPhone || !emailCustomer) {
			return res.status(400).json({ message: "thiếu thông tin khi sửa đơn hàng" })
		}

		const updatedOrder = await Order.findByIdAndUpdate(
			orderId,
			{
				table_id, status, orderedAt, customerName
				, customerPhone
				, emailCustomer,
				user_id
			},
			{ new: true, runValidators: true }
		);

		if (!updatedOrder) {
			return res.status(404).json({ message: 'Không tìm thấy đơn đặt bàn' });
		}

		res.json({ message: "Cập nhật đơn hàng thành công", updatedOrder });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi cập nhật đơn đặt bàn', error: err.message });
	}
};

//[DELETE] api/orders/:orderId Xóa đơn đặt bàn 
exports.deleteOrderById = async (req, res) => {
	try {
		const { orderId } = req.params;

		// 1. Tìm đơn đặt bàn
		const order = await Order.findById(orderId);
		if (!order) {
			return res.status(404).json({ message: 'Không tìm thấy đơn đặt bàn' });
		}

		// 2. Cập nhật bàn thành 'available'
		const table = await Table.findById(order.table_id);
		if (table) {
			table.status = 'available';
			await table.save();
		}

		// 3. Đánh dấu đơn đã xóa
		order.deleted = true;
		await order.save();

		res.status(200).json({ message: "Xóa đơn đặt bàn thành công", order });
	} catch (err) {
		res.status(500).json({
			message: 'Lỗi khi xóa chi tiết đơn đặt bàn',
			error: err.message
		});
	}
};
