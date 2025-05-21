const Order = require('../models/Order');
const User = require('../models/User');

//[POST] /api/orders/ Tạo đơn đặt bàn mới ( admin)
exports.createOrder = async (req, res) => {
	try {
		const { table_id, customerName, customerPhone, emailCustomer } = req.body;
		const user_id = req.user.userId; // lấy từ token

		if (!table_id || !customerName || !customerPhone || !emailCustomer || !user_id) {
			return res.status(400).json("thiếu dữ liêụ khi tạo đơn đặt bàn")
		}

		const newOrder = await Order.create({
			table_id,
			user_id,
			customerName,
			customerPhone,
			emailCustomer
		});
		res.status(200).json({ message: "Tạo đơn đặt bàn thành công", newOrder });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi tạo đơn đặt bàn', error: err.message });
	}
};

//[POST] /api/client Tạo đơn đặt bàn mới (nguoi dung)
exports.createOrderClient = async (req, res) => {
	try {
		const { table_id, customerName, customerPhone, emailCustomer } = req.body;

		if (!table_id || !customerName || !customerPhone || !emailCustomer || !user_id) {
			return res.status(400).json("thiếu dữ liêụ khi tạo đơn đặt bàn")
		}

		const user = await User.findOne({ username: "admin" })
		const user_id = user._id

		const newOrder = await Order.create({
			table_id,
			user_id,
			customerName,
			customerPhone,
			emailCustomer
		});

		res.status(200).json({ message: "đặt bàn thành công", newOrder });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi tạo đơn đặt bàn', error: err.message });
	}
}

//[GET] api/orders?page=1&limit=10 Xem danh sách đơn đặt bàn
exports.getAllOrders = async (req, res) => {
	try {
		// phan trang
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const orders = await Order.find({ deleted: false })
			.skip(skip).limit(limit).sort({ createAt: -1 })

		const totalPage = Math.ceil(orders.length / limit)

		res.status(200).json({ message: "lấy danh sách đơn đặt bàn thành công", orders, totalPage });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn đặt bàn', error: err.message });
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
exports.getOrderDetail = async (req, res) => {
	try {
		const { orderId } = req.params;

		// Lấy thông tin đơn đặt bàn + danh sách các món trong đơn
		const order = await Order.findByIdAndUpdate(orderId,
			{ deleted: true }).populate({
				path: 'orderItems',
				populate: {
					path: 'dish_id',
					select: 'name price description', // Lấy thông tin món ăn
				},
			});

		if (!order) {
			return res.status(404).json({ message: 'Không tìm thấy đơn đặt bàn' });
		}

		res.status(200).json({ message: "xóa chi tiết đơn thành công", order });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi xóa chi tiết đơn đặt bàn', error: err.message });
	}
};