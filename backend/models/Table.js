const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
	tableNumber: {
		type: Number,
	},

	capacity: {
		type: Number,
		required: true,
	},

	status: {
		type: String,
		enum: ['available', 'booked', 'in_service'],
		default: 'available',
	},
	deleted: {
		type: Boolean,
		default: false,
	}
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
