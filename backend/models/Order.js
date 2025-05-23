const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
	{
		table_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Table',
			required: true
		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		status: {
			type: String,
			enum: ['pending', 'confirmed', 'completed', 'rejected'],
			default: 'pending'
		},
		orderTime: {
			type: String,
			required: true
		},
		orderedAt: {
			type: Date,
			default: Date.now
		},
		customerName: {
			type: String,
			required: true
		},
		customerPhone: {
			type: String,
			required: true
		},
		emailCustomer: {
			type: String,
		},
		orderItems: [
			{
				dish_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Dish',
				},
				price: Number,
				quantity: Number,
			}
		],
		totalAmount: {
			type: Number,
			default: 0
		},
		deleted: {
			type: Boolean,
			default: false,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
