const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const tableRoutes = require('./routes/tableRoutes');
const authRoutes = require('./routes/authRoutes');
const dishRoutes = require('./routes/dishRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const userRouter = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/tables', tableRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orderItems', orderItemRoutes);
app.use('/api/categories', categoryRoutes);


// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
	.then(() => {
		console.log('✅ Kết nối MongoDB thành công');
		app.listen(process.env.PORT, () => {
			console.log(`🚀 Server chạy ở cổng ${process.env.PORT}`);
		});
	})
	.catch(err => console.log('❌ Lỗi kết nối MongoDB:', err));
