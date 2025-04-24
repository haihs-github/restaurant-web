import React, { useState } from 'react';
import { deleteOrder, updateOrder } from './orderApi';

const OrderListItem = ({ order, onOrderUpdate }) => {
	const [status, setStatus] = useState(order.status);

	const handleUpdate = async () => {
		await updateOrder(order._id, { status });
		onOrderUpdate();
	};

	const handleDelete = async () => {
		if (window.confirm('Bạn có chắc muốn xoá đơn hàng này?')) {
			await deleteOrder(order._id);
			onOrderUpdate();
		}
	};

	return (
		<div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
			<p><strong>Bàn:</strong> {order.table_id}</p>
			<p><strong>Khách:</strong> {order.customerName}</p>
			<p><strong>SDT:</strong> {order.customerPhone}</p>
			{<p><strong>SDT:</strong> {order.emailCustomer}</p>}
			<p><strong>Trạng thái:</strong>
				<select value={status} onChange={(e) => setStatus(e.target.value)}>
					<option value="pending">Chờ xác nhận</option>
					<option value="confirmed">Đã xác nhận</option>
					<option value="served">Đã phục vụ</option>
					<option value="completed">Hoàn thành</option>
					<option value="rejected">Từ chối</option>
				</select>
			</p>
			<button onClick={handleUpdate}>Cập nhật</button>
			<button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>Xoá</button>
		</div>
	);
};

export default OrderListItem;