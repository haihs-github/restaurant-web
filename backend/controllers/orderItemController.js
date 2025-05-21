const OrderItem = require('../models/OrderItem');
// const Order = require('../models/Order');
const Dish = require('../models/Dish');

// [GET] /api/oderItems?page=1&limit=10 - lấy ra toàn bộ orderItems của 1 order 
exports.getItemFromOrder = async (req, res) => {
	const { orderId } = req.params;
	try {
		const orderItems = await OrderItem.find({ order_id: orderId })
		if (!orderItems || orderItems.lenght <= 0) {
			return res.status(400).json({ message: "Đơn hàng trống hoặc tìm thấy đơn hàng" })
		}
		res.status(200).json({ message: "lấy dữ liệu đơn hàng thành công", orderItems })
	} catch (err) {
		return res.status(500).json({ message: "loi khi lay du lieu don hang", errr })
	}
}

//[POST] /api/oderItems/:orderId  Thêm món vào đơn hàng
exports.addItemToOrder = async (req, res) => {
	const { orderId } = req.params;
	const { dish_id, quantity } = req.body;

	if (!dish_id || !quantity) {
		return res.status(400).json({ message: 'Thiếu thông tin khi tạo chi tiết đơn hàng' });
	}

	try {
		// Kiểm tra món ăn có tồn tại không
		const dish = await Dish.findById(dish_id);
		if (!dish || !dish.deleted) {
			return res.status(404).json({ message: 'ko tìm thấy món ăn' });
		}

		// Tạo OrderItem mới
		const newItem = new OrderItem({
			order_id: orderId,
			dish_id,
			quantity
		});

		await newItem.save();

		// // Đẩy _id của OrderItem vào mảng orderItems của đơn hàng
		// const order = await Order.findById(orderId);
		// if (!order) {
		// 	return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
		// }
		// order.orderItems.push(newItem._id);
		// await order.save();

		res.status(201).json({ message: 'Thêm món vào đơn thành công', item: newItem });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi thêm món vào đơn', error: err.message });
	}
};

//[PUT] /api/oderItems/:id  chỉnh sửa món trong đơn hàng 
exports.updateOrderItem = async (req, res) => {
	const { orderItemId } = req.params;
	const { dish_id, quantity } = req.body;

	try {
		const orderItem = await OrderItem.findOne({ _id: itemId });
		if (!orderItem) {
			return res.status(404).json({ message: 'Không tìm thấy món trong đơn hàng' });
		}

		if (dish_id) {
			const dish = await Dish.findById(dish_id);
			if (!dish || dish.deleted) {
				return res.status(404).json({ message: 'không tìm thấy món ăn' });
			}
			orderItem.dish_id = dish_id;
		}

		if (!quantity) {
			orderItem.quantity = quantity;
		}

		await orderItem.save();

		res.json({ message: 'Cập nhật món trong đơn thành công', item: orderItem });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi cập nhật món trong đơn', error: err.message });
	}
};

//[DELETE] /api/oderItems/:id xóa món khỏi đơn hàng 
exports.deleteOrderItem = async (req, res) => {
	const { itemId } = req.params;

	try {
		// Tìm và xóa OrderItem
		const item = await OrderItem.findOneAndDelete({ _id: itemId });

		if (!item) {
			return res.status(404).json({ message: 'Không tìm thấy món để xóa' });
		}

		// Xoá ID khỏi mảng orderItems của Order
		await OrderItem.findByIdAndUpdate(itemId,
			{ deleted: true },
			{ new: true }
		);

		res.json({ message: '🗑️ Xóa món khỏi đơn hàng thành công' });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi xóa món khỏi đơn', error: err.message });
	}
};

