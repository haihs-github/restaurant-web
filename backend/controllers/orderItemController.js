const OrderItem = require('../models/OrderItem');
const Order = require('../models/Order');
const Dish = require('../models/Dish');

// Thêm món vào đơn hàng
const addItemToOrder = async (req, res) => {
	const { orderId } = req.params;
	const { dish_id, quantity } = req.body;

	if (!dish_id || !quantity) {
		return res.status(400).json({ message: 'Vui lòng cung cấp dish_id và quantity' });
	}

	try {
		// Kiểm tra món ăn có tồn tại không
		const dish = await Dish.findById(dish_id);
		if (!dish || !dish.isAvailable) {
			return res.status(404).json({ message: 'Món ăn không tồn tại hoặc không phục vụ' });
		}

		// Tạo OrderItem mới
		const newItem = new OrderItem({
			order_id: orderId,
			dish_id,
			quantity
		});

		await newItem.save();

		// Đẩy _id của OrderItem vào mảng orderItems của đơn hàng
		const order = await Order.findById(orderId);
		console.log("order", order)
		if (!order) {
			return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
		}
		order.orderItems.push(newItem._id);
		await order.save();

		res.status(201).json({ message: '✅ Thêm món vào đơn thành công', item: newItem });
	} catch (err) {
		res.status(500).json({ message: '❌ Lỗi khi thêm món vào đơn', error: err.message });
	}
};

// chỉnh sửa món trong đơn hàng 
const updateOrderItem = async (req, res) => {
	const { orderId, itemId } = req.params;
	const { dish_id, quantity } = req.body;

	try {
		const orderItem = await OrderItem.findOne({ _id: itemId, order_id: orderId });
		if (!orderItem) {
			return res.status(404).json({ message: 'Không tìm thấy món trong đơn hàng' });
		}

		// Nếu có truyền dish_id mới thì kiểm tra món có tồn tại và khả dụng
		if (dish_id) {
			const dish = await Dish.findById(dish_id);
			if (!dish || !dish.isAvailable) {
				return res.status(404).json({ message: 'Món ăn không tồn tại hoặc không phục vụ' });
			}
			orderItem.dish_id = dish_id;
		}

		// Nếu có truyền quantity mới thì cập nhật
		if (quantity !== undefined) {
			orderItem.quantity = quantity;
		}

		await orderItem.save();

		res.json({ message: '✅ Cập nhật món trong đơn thành công', item: orderItem });
	} catch (err) {
		res.status(500).json({ message: '❌ Lỗi khi cập nhật món trong đơn', error: err.message });
	}
};

// xóa món khỏi đơn hàng 
const deleteOrderItem = async (req, res) => {
	const { orderId, itemId } = req.params;

	try {
		// Tìm và xóa OrderItem
		const item = await OrderItem.findOneAndDelete({ _id: itemId, order_id: orderId });

		if (!item) {
			return res.status(404).json({ message: 'Không tìm thấy món để xóa' });
		}

		// Xoá ID khỏi mảng orderItems của Order
		await Order.findByIdAndUpdate(orderId, {
			$pull: { orderItems: itemId }
		});

		res.json({ message: '🗑️ Xóa món khỏi đơn hàng thành công' });
	} catch (err) {
		res.status(500).json({ message: '❌ Lỗi khi xóa món khỏi đơn', error: err.message });
	}
};

module.exports = {
	addItemToOrder,
	updateOrderItem,
	deleteOrderItem
};
