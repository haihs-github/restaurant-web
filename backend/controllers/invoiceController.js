const Invoice = require('../models/Invoice');
const Order = require('../models/Order');

// Tạo hóa đơn cho đơn hàng đã hoàn tất
const createInvoice = async (req, res) => {
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

		res.status(201).json({ message: '🧾 Hóa đơn được tạo thành công', invoice: newInvoice });
	} catch (err) {
		res.status(500).json({ message: '❌ Lỗi tạo hóa đơn', error: err.message });
	}
};

// Lấy danh sách tất cả hóa đơn
const getAllInvoices = async (req, res) => {
	try {
		const invoices = await Invoice.find().populate({
			path: 'order_id',
			populate: { path: 'table_id', select: 'name' } // lấy tên bàn nếu có
		});
		res.json(invoices);
	} catch (err) {
		res.status(500).json({ message: '❌ Lỗi khi lấy danh sách hóa đơn', error: err.message });
	}
};

// Lấy hóa đơn theo bàn cụ thể
const getInvoicesByTable = async (req, res) => {
	const { tableId } = req.params;

	try {
		// Tìm tất cả order của bàn đó
		const orders = await Order.find({ table_id: tableId }).select('_id');
		const orderIds = orders.map(order => order._id);

		// Lấy hóa đơn liên quan đến các order của bàn đó
		const invoices = await Invoice.find({ order_id: { $in: orderIds } }).populate('order_id');

		res.json(invoices);
	} catch (err) {
		res.status(500).json({ message: '❌ Lỗi khi lấy hóa đơn theo bàn', error: err.message });
	}
};

// Xem chi tiết 1 hóa đơn
const getInvoiceById = async (req, res) => {
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

		res.json(invoice);
	} catch (err) {
		res.status(500).json({ message: '❌ Lỗi khi lấy chi tiết hóa đơn', error: err.message });
	}
};


// Cập nhật thông tin hóa đơn (ví dụ đổi trạng thái hoặc thông tin khách hàng)
const updateInvoice = async (req, res) => {
	const { invoiceId } = req.params;
	const { status, customerName, customerPhone, emailCustomer } = req.body;

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

		res.json({ message: '📝 Cập nhật hóa đơn thành công', invoice: updatedInvoice });
	} catch (err) {
		res.status(500).json({ message: '❌ Lỗi khi cập nhật hóa đơn', error: err.message });
	}
};

// Xóa hóa đơn
const deleteInvoice = async (req, res) => {
	const { invoiceId } = req.params;

	try {
		const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId);

		if (!deletedInvoice) {
			return res.status(404).json({ message: 'Không tìm thấy hóa đơn để xóa' });
		}

		res.json({ message: '🗑️ Xóa hóa đơn thành công', invoice: deletedInvoice });
	} catch (err) {
		res.status(500).json({ message: '❌ Lỗi khi xóa hóa đơn', error: err.message });
	}
};

module.exports = {
	createInvoice,
	getAllInvoices,
	getInvoicesByTable,
	getInvoiceById,
	updateInvoice,
	deleteInvoice
};

