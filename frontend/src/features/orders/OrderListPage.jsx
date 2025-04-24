import React, { useEffect, useState } from 'react';
import { getAllOrders } from './orderApi';
import OrderListItem from './OrderListItem';
import OrderForm from './OrderForm';
import Header from '../../components/Header';

const OrderListPage = () => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		loadOrders();
	}, []);

	const loadOrders = () => {
		getAllOrders()
			.then(setOrders)
			.catch((err) => console.error('Lỗi khi lấy danh sách đơn hàng:', err));
	};

	return (
		<div>
			<Header />
			<OrderForm onOrderCreated={loadOrders} />

			<h2>Danh sách đơn hàng</h2>
			{orders.map((order) => (
				<OrderListItem
					key={order._id}
					order={order}
					onOrderUpdate={loadOrders}
				/>
			))}
		</div>
	);
};

export default OrderListPage;
