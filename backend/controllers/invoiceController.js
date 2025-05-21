const { create } = require('../models/Dish');
const Invoice = require('../models/Invoice');
const Order = require('../models/Order');

//[POST] /api/invoices/ Tạo hóa đơn cho đơn hàng đã hoàn tất
exports.createInvoice = async (req, res) => {
	const { order_id } = req.body;

	try {
		const order = await Order.findById(order_id).populate({
			path: 'orderItems',
			populate: { path: 'dish_id', select: 'price' }
		});

		if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

		// Tính tổng tiền từ các món
		let totalAmount = 0;
		for (const item of order.orderItems) {
			totalAmount += item.dish_id.price * item.quantity;
		}

		const newInvoice = await Invoice.create({
			order_id,
			totalAmount,
		});

		res.status(201).json({ message: 'Hóa đơn được tạo thành công', invoice: newInvoice });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi tạo hóa đơn', error: err.message });
	}
};

//[GET] /api/invoices?page=1&limit=10 Lấy danh sách tất cả hóa đơn
exports.getAllInvoices = async (req, res) => {
	try {
		// phan trang
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const invoices = await Invoice.find({ deleted: false }).populate({
			path: 'order_id',
			populate: { path: 'table_id', select: 'name' } // lấy tên bàn nếu có
		}).skip(skip).limit(limit).sort({ createAt: -1 });

		const totalPage = Math.ceil(invoices.length / limit)

		res.status(200).json({
			message: "lấy đơn hàng thành công", invoices,
			totalPage
		});
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy danh sách hóa đơn', error: err.message });
	}
};

//[GET] /api/invoices/:tableId?page=1&limit=10 Lấy hóa đơn theo bàn cụ thể
exports.getInvoicesByTable = async (req, res) => {
	try {
		const { tableId } = req.params;
		// phan trang
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;


		// Tìm tất cả order của bàn đó
		const orders = await Order.find({ table_id: tableId }).select('_id');
		const orderIds = orders.map(order => order._id);

		// Lấy hóa đơn liên quan đến các order của bàn đó
		const invoices = await Invoice.find({ order_id: { $in: orderIds } }).populate('order_id')
			.skip(skip).limit(limit).sort({ createAt: -1 });
		const totalPage = Math.ceil(invoices.length / limit)
		res.status(200).json({
			message: "lấy đơn hàng thành công",
			invoices,
			totalPage
		});
	} catch (err) {
		res.status(500).json({ message: '❌ Lỗi khi lấy hóa đơn theo bàn', error: err.message });
	}
};

//[GET] /api/invoices/:invoiceId Xem chi tiết 1 hóa đơn
exports.getInvoiceById = async (req, res) => {
	const { invoiceId } = req.params;

	try {
		const invoice = await Invoice.findById(invoiceId)
			.populate({
				path: 'order_id',
				populate: [
					{ path: 'table_id', select: 'name' },
					{
						path: 'orderItems',
						populate: { path: 'dish_id', select: 'name price' }
					}
				]
			});

		if (!invoice) {
			return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
		}

		res.status(200).json({ message: "lấy hóa đơn thành công", invoice });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi lấy chi tiết hóa đơn', error: err.message });
	}
};


//[PUT] /api/invoices/:invoiceId sửa thông tin hóa đơn
exports.updateInvoice = async (req, res) => {
	const { invoiceId } = req.params;
	const { status } = req.body;

	try {
		const updatedInvoice = await Invoice.findByIdAndUpdate(
			invoiceId,
			{
				status,
			},
			{ new: true }
		);

		if (!updatedInvoice) {
			return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
		}

		res.status(200).json({ message: 'Cập nhật hóa đơn thành công', invoice: updatedInvoice });
	} catch (err) {
		res.status(500).json({ message: 'Lỗi khi cập nhật hóa đơn', error: err.message });
	}
};

//[DELETE] /api/invoices/:invoiceId Xóa hóa đơn
exports.deleteInvoice = async (req, res) => {
	const { invoiceId } = req.params;

	try {
		const deletedInvoice = await Invoice.findByIdAndUpdate(invoiceId,
			{ deleted: true },
			{ new: true }
		);

		if (!deletedInvoice) {
			return res.status(404).json({ message: 'Không tìm thấy hóa đơn để xóa' });
		}

		res.json({ message: '🗑️ Xóa hóa đơn thành công', invoice: deletedInvoice });
	} catch (err) {
		res.status(500).json({ message: '❌ Lỗi khi xóa hóa đơn', error: err.message });
	}
};


