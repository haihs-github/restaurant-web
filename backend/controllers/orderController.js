const Order = require('../models/Order');
const User = require('../models/User');
const Table = require('../models/Table');
const Dish = require('../models/Dish');
const OrderItem = require('../models/OrderItem')
const dayjs = require('dayjs');

//[POST] /api/orders/ Tạo đơn đặt bàn mới ( admin)
exports.createOrder = async (req, res) => {
	try {
		const { table_id, customerName, customerPhone, emailCustomer, orderItems, orderTime } = req.body;
		const user_id = req.user?.userId || null; // nếu có middleware xác thực

		if (!table_id || !customerName || !customerPhone || !emailCustomer || !orderTime) {
			console.log(table_id, customerName, customerPhone, emailCustomer, orderTime)
			console.log("thieu du lieu")
			return res.status(400).json({ message: "Thiếu dữ liệu khi tạo đơn đặt bàn" });
		}
		let totalAmount = 0;

		// Tạo đơn đặt bàn
		const newOrder = await Order.create({
			table_id,
			user_id,
			customerName,
			customerPhone,
			emailCustomer,
			orderTime
		});

		// Tạo orderItems nếu có
		if (orderItems && orderItems.length > 0) {
			for (const item of orderItems) {
				console.log('item', item);
				const dish = await Dish.findOne({ name: item.name, deleted: false });
				if (!dish) {
					return res.status(400).json({ message: `Không tìm thấy món: ${item.name}` });
				}

				const orderItem = new OrderItem({
					order_id: newOrder._id,
					dish_id: dish._id,
					price: item.price,
					quantity: item.quantity,
				});
				await orderItem.save();

				totalAmount += item.price * item.quantity;
			}
		}

		// Cập nhật tổng tiền
		newOrder.totalAmount = totalAmount;

		res.status(200).json({
			message: "Tạo đơn đặt bàn thành công",
			order: newOrder,
		});
	} catch (err) {
		console.error("Lỗi khi tạo đơn đặt bàn:", err);
		res.status(500).json({ message: 'Lỗi khi tạo đơn đặt bàn', error: err.message });
	}
};

//[PUT] /api/orders/:id Tạo đơn đặt bàn mới ( admin)
exports.updateOrder = async (req, res) => {
	try {
		const { orderId } = req.params;
		const {
			table_id,
			status,
			customerName,
			customerPhone,
			emailCustomer,
			orderTime
		} = req.body;

		const validStatuses = ['pending', 'confirmed', 'completed', 'rejected'];
		if (status && !validStatuses.includes(status)) {
			return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
		}

		if (!orderId || !status || !customerName || !customerPhone || !emailCustomer || !orderTime) {
			return res.status(400).json({ message: "Thiếu thông tin khi sửa đơn hàng" });
		}

		// const exsitingOrder = await Order.findOne({ table_id: table_id, orderTime: orderTime, status: "confirmed", deleted: false });
		// if (exsitingOrder) {
		// 	return res.status(400).json({ message: "Bàn này đã được đặt rồi" });
		// }

		const updatedOrder = await Order.findByIdAndUpdate(
			orderId,
			{
				table_id,
				status,
				customerName,
				customerPhone,
				emailCustomer,
				orderTime
			},
			{ new: true, runValidators: true }
		);

		if (!updatedOrder) {
			return res.status(404).json({ message: 'Không tìm thấy đơn đặt bàn' });
		}
		res.json({ message: "Cập nhật đơn hàng thành công", updatedOrder });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi cập nhật đơn đặt bàn', error: err });
	}
};

//[PUT] /api/orders/done/:orderId danh dau complted( admin)
exports.doneOrder = async (req, res) => {
	try {
		const { orderId } = req.params;
		const orderItems = req.body.orderItems
		console.log("orderItems 1", orderItems)
		console.log(orderItems)
		let saveOrder = []
		let totalAmount = 0
		for (const item of orderItems) {
			totalAmount += item.price * item.quantity
			await OrderItem.create({
				order_id: orderId,
				dish_id: item.dish_id,
				price: item.price,
				quantity: item.quantity
			});
		}

		console.log('orderItems', orderItems)
		const updatedOrder = await Order.findByIdAndUpdate(
			orderId,
			{
				status: "completed",
				totalAmount: totalAmount
			},
			{ new: true, runValidators: true }
		);

		if (!updatedOrder) {
			return res.status(404).json({ message: 'Không tìm thấy đơn đặt bàn' });
		}
		res.json({ message: "Cập nhật đơn hàng thành công", updatedOrder });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi cập nhật đơn đặt bàn', error: err });
	}
};


//[GET] api/orders?page=1&limit=10?customerName=hải? Xem danh sách đơn đặt bàn
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
		const getAllOrders = await Order.find({ deleted: false })
		res.status(200).json({
			message: "Lấy danh sách đơn đặt bàn thành công",
			orders,
			totalPage,
			getAllOrders
		});
	} catch (err) {
		res.status(500).json({
			message: 'Lỗi khi lấy danh sách đơn đặt bàn',
			error: err.message
		});
	}
};

// [GET] /api/orders?page=1&limit=10&customerName=Hải&status=pendingXem danh sách đơn đặt bàn theo query
exports.getOrderFilter = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const { customerName = '', status = '' } = req.query;

		// Xây điều kiện lọc động
		const query = { deleted: false };

		if (customerName !== '') {
			query.customerName = { $regex: customerName, $options: 'i' };
		}
		if (status !== '') {
			query.status = status;
		}

		// Đếm tổng số đơn hàng sau khi lọc
		const totalOrders = await Order.countDocuments(query);

		// Lấy danh sách đơn hàng theo trang hiện tại
		const orders = await Order.find(query)
			.populate('table_id', 'tableNumber')
			.populate('user_id', 'username')
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 });

		const totalPage = Math.ceil(totalOrders / limit);

		// Lấy toàn bộ đơn hàng nếu muốn lọc thêm ở frontend
		const getAllOrders = await Order.find(query)
			.populate('table_id', 'tableNumber')
			.populate('user_id', 'username')
			.sort({ createdAt: -1 });

		res.status(200).json({
			message: 'Lấy danh sách đơn đặt bàn thành công',
			orders,
			totalPage,
			getAllOrders,
		});
	} catch (err) {
		res.status(500).json({
			message: 'Lỗi khi lấy danh sách đơn đặt bàn',
			error: err.message,
		});
	}
};



//[GET] api/orders/:orderId xem chi tiết đơn đặt bàn 
exports.getOrderDetail = async (req, res) => {
	try {
		const { orderId } = req.params;
		const orderItems = await OrderItem.find({ order_id: orderId }).populate('dish_id');
		// Lấy thông tin đơn đặt bàn + danh sách các món trong đơn
		const order = await Order.findById(orderId);
		order.orderItems = orderItems;

		if (!order) {
			return res.status(404).json({ message: 'Không tìm thấy đơn đặt bàn' });
		}

		res.status(200).json({ message: "Lấy chi tiết đơn thành công", order });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn đặt bàn', error: err.message });
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

//[GET] api/time/:time
exports.getOrderByTime = async (req, res) => {
	try {
		const { time } = req.params;

		const now = dayjs();
		let startDate, endDate;

		if (time === 'ngày') {
			startDate = now.startOf('day');
			endDate = now.endOf('day');
		} else if (time === 'tháng') {
			startDate = now.startOf('month');
			endDate = now.endOf('month');
		} else if (time === 'năm') {
			startDate = now.startOf('year');
			endDate = now.endOf('year');
		} else {
			return res.status(400).json({ message: 'Tham số thời gian không hợp lệ. Chỉ nhận ngày, tháng, năm' });
		}

		// Lấy đơn hàng theo khoảng thời gian
		const orders = await Order.find({
			orderTime: {
				$gte: startDate.toISOString(),
				$lte: endDate.toISOString(),
			},
		});

		// Phân loại đơn theo trạng thái
		const statusCount = {
			pending: 0,
			confirmed: 0,
			completed: 0,
			rejected: 0,
		};

		let totalAmount = 0;

		orders.forEach(order => {
			const status = order.status;
			if (statusCount.hasOwnProperty(status)) {
				statusCount[status]++;
			}
			// Cộng dồn tiền (nếu có trường totalAmount)
			if (order.totalAmount) {
				totalAmount += order.totalAmount;
			}
		});

		res.status(200).json({
			totalOrders: orders.length,
			totalAmount,
			statusCount,
			orders,
		});
	} catch (error) {
		res.status(500).json({ message: 'Lỗi khi lấy đơn hàng theo thời gian', error: error.message });
	}
};
