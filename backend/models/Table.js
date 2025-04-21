const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
	tableNumber: {
		type: Number,
		required: true,
		unique: true,
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

	isAvailable: {
		type: Boolean,
		default: true,
	}
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
