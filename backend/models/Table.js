const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
	tableNumber: {
		type: Number,
		min: 1,
		required: true,
	},

	capacity: {
		type: Number,
		min: 1,
		required: true,
	},

	status: {
		type: String,
		enum: ['available', 'booked'],
		default: 'available',
	},
	deleted: {
		type: Boolean,
		default: false,
	}
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
