import React, { useState, useEffect } from 'react';
import { createOrder, createOrderClient } from './orderApi';

const OrderForm = ({ initialTableId = '', onOrderCreated }) => {
	const [formData, setFormData] = useState({
		table_id: initialTableId,
		customerName: '',
		customerPhone: '',
		emailCustomer: ''
	});

	// Cập nhật table_id khi initialTableId thay đổi (đặt lại form đúng id bàn)
	useEffect(() => {
		setFormData((prev) => ({ ...prev, table_id: initialTableId }));
	}, [initialTableId]);

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createOrder(formData);
			setFormData({
				table_id: '',
				customerName: '',
				customerPhone: '',
				emailCustomer: ''
			});
		} catch (err) {
			try {
				await createOrderClient(formData);
				setFormData({
					table_id: '',
					customerName: '',
					customerPhone: '',
					emailCustomer: ''
				});
			} catch (err) {
				console.error('Lỗi khi tạo đơn hàng:', err);
			}
			console.error('Lỗi khi tạo đơn hàng:', err);
		}

	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Tạo đơn hàng mới</h2>
			<div>
				<label>ID bàn:</label>
				<input
					type="text"
					name="table_id"
					value={formData.table_id}
					onChange={handleInputChange}
					required
				/>
			</div>
			<div>
				<label>Tên khách hàng:</label>
				<input
					type="text"
					name="customerName"
					value={formData.customerName}
					onChange={handleInputChange}
					required
				/>
			</div>
			<div>
				<label>SĐT khách hàng:</label>
				<input
					type="text"
					name="customerPhone"
					value={formData.customerPhone}
					onChange={handleInputChange}
					required
				/>
			</div>
			<div>
				<label>Email (nếu có):</label>
				<input
					type="email"
					name="emailCustomer"
					value={formData.emailCustomer}
					onChange={handleInputChange}
				/>
			</div>
			<button type="submit">Tạo đơn hàng</button>
		</form>
	);
};

export default OrderForm;
