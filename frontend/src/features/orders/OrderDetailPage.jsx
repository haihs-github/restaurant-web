import React, { useEffect, useState } from 'react';
import { getOrderDetail, updateOrder } from '../api/orderApi';
import { useParams } from 'react-router-dom';

const OrderDetailPage = () => {
	const { orderId } = useParams();
	const [order, setOrder] = useState(null);
	const [status, setStatus] = useState('');

	useEffect(() => {
		getOrderDetail(orderId)
			.then((data) => {
				setOrder(data);
				setStatus(data.status);
			})
			.catch(console.error);
	}, [orderId]);

	const handleUpdate = async () => {
		try {
			const updated = await updateOrder(orderId, { status });
			setOrder(updated);
			alert('Cập nhật thành công!');
		} catch (err) {
			alert('Lỗi khi cập nhật đơn hàng');
		}
	};

	if (!order) return <p>Đang tải...</p>;

	return (
		<div>
			<h2>Chi tiết đơn hàng</h2>
			<p><strong>Bàn:</strong> {order.table_id}</p>
			<p><strong>Tên khách:</strong> {order.customerName}</p>
			<p><strong>SĐT:</strong> {order.customerPhone}</p>
			<p><strong>Email:</strong> {order.emailCustomer}</p>
			<p><strong>Ngày đặt:</strong> {new Date(order.orderedAt).toLocaleString()}</p>

			<label>
				Trạng thái:
				<select value={status} onChange={(e) => setStatus(e.target.value)}>
					<option value="pending">Chờ xác nhận</option>
					<option value="confirmed">Đã xác nhận</option>
					<option value="served">Đã phục vụ</option>
					<option value="completed">Hoàn thành</option>
					<option value="rejected">Từ chối</option>
				</select>
			</label>
			<button onClick={handleUpdate}>Cập nhật</button>
		</div>
	);
};

export default OrderDetailPage;
