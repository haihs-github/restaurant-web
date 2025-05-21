const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

// Cấu hình lưu trữ trên Cloudinary
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'restaurant', // tên folder lưu trên Cloudinary
		allowed_formats: ['jpg', 'png', 'jpeg'],
		transformation: [{ width: 500, height: 500, crop: 'limit' }],
	},
});

// Tạo middleware upload
const upload = multer({ storage });

module.exports = upload;
