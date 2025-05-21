const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
	category_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true, // Nếu bạn muốn bắt buộc
	},
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	thumbnail: {
		type: String,
		required: true
	},
	deleted: {
		type: Boolean,
		default: false,
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Dish', dishSchema);
