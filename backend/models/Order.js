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
			required: true
		},
		status: {
			type: String,
			enum: ['pending', 'confirmed', 'served', 'completed', 'rejected'],
			default: 'pending'
		},
		orderedAt: {
			type: Date,
			default: Date.now
		},
		orderItems: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'OrderItem'
			}
		],
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
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
