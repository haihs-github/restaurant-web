const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
	},

	fullname: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},

	phone: {
		type: String,
		required: true,
	},

	role: {
		type: String,
		enum: ['admin', 'staff'],
		default: 'staff',
	},

	deleted: {
		type: Boolean,
		default: false,
	}

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
