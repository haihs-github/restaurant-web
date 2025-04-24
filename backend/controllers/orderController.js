const Order = require('../models/Order');

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
	try {
		const { table_id } = req.body;
		const user_id = req.user.userId; // lấy từ token

		const newOrder = await Order.create({
			table_id,
			user_id,
			status: 'pending',
			orderedAt: new Date(),
			customerName,
			customerPhone,
			emailCustomer
		});

		res.status(201).json(newOrder);
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error: err.message });
	}
};

// Xem danh sách đơn hàng
const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find()
		// .populate('table_id', 'tableNumber')   // chỉ lấy số bàn
		// .populate('user_id', 'fullname');      // chỉ lấy họ tên người tạo

		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng', error: err.message });
	}
};

// xem chi tiết đơn hàng 
const getOrderDetail = async (req, res) => {
	try {
		const { orderId } = req.params;

		// Lấy thông tin đơn hàng + danh sách các món trong đơn
		const order = await Order.findById(orderId).populate({
			path: 'orderItems',
			populate: {
				path: 'dish_id',
				select: 'name price description', // Lấy thông tin món ăn
			},
		});

		if (!order) {
			return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
		}

		res.json(order);
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn hàng', error: err.message });
	}
};

// update đơn hàng 
const updateOrder = async (req, res) => {
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

		const updatedOrder = await Order.findByIdAndUpdate(
			orderId,
			{
				table_id, status, orderedAt, customerName
				, customerPhone
				, emailCustomer
			},
			{ new: true, runValidators: true }
		);

		if (!updatedOrder) {
			return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
		}

		res.json(updatedOrder);
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi cập nhật đơn hàng', error: err.message });
	}
};

module.exports = {
	createOrder,
	getAllOrders,
	updateOrder,
	getOrderDetail,

};
