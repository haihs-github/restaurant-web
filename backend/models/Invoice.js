const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema(
	{
		order_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Order',
			required: true
		},
		totalAmount: {
			type: Number,
		},
		issuedAt: {
			type: Date,
			default: Date.now
		},
		status: {
			type: String,
			enum: ['paid', 'unpaid'],
			default: 'unpaid'
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
