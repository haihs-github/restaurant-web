const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	description: { type: String },
	category: { type: String },
	isAvailable: { type: Boolean, default: true },
}, {
	timestamps: true
});

module.exports = mongoose.model('Dish', dishSchema);
