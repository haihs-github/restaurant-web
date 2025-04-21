const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
	order_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Order',
		required: true,
	},
	dish_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dish',
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
});

module.exports = mongoose.model('OrderItem', orderItemSchema);