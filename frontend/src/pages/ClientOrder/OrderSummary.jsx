import React, { useEffect } from 'react';
import styles from './OrderSummary.module.scss';
import axios from 'axios';

const OrderSummary = ({ orders, onRemoveOrderItem, handleQuantityChange, total, selectedOrder, setSelectedOrder, orderItems }) => {

	useEffect(() => {
		console.log('orders', orders)
	}, [orders])
	useEffect(() => {
		console.log('selectedOrder', selectedOrder)

	}, [selectedOrder])
	useEffect(() => {
		console.log('orderItems', orderItems)
	}, [orderItems])

	const updateOrder = async (selectedOrder) => {
		try {
			const res = await axios.put(`http://localhost:5000/api/orders/doneOrder/${selectedOrder._id}`, {
				orderItems: orderItems
			}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			alert("Cập nhật đơn hàng thành công");
			console.log("Cập nhật đơn hàng thành công:", res.data);
		} catch (error) {
			alert("Lỗi khi cập nhật đơn hàng");

			console.error("Lỗi khi cập nhật đơn hàng:", error);
		}
	};


	return (
		<div className={styles.orderSummaryContainer}>
			<div className={styles.orderHeader}>
				<div className={styles.tableSelection}>
					<span className={styles.tableIcon}>&#x268F;</span>
					<select
						value={selectedOrder}
						onChange={(e) => setSelectedOrder(e.target.value)} // dùng value, không dùng object
						className={styles.tableSelect}
					>
						{orders.filter(order => order.status === "confirmed").map(order => (
							<option key={order._id} value={order._id}>
								#{order.table_id?.tableNumber} - {order.customerName} {order.customerPhone}
							</option>
						))}
					</select>


				</div>
			</div>
			<div className={styles.orderItemsList}>
				{orderItems.length === 0 ? (
					<p className={styles.emptyOrderMessage}>Không có sản phẩm nào trong đơn</p>
				) : (
					orderItems.map((item) => (
						<div key={item._id} className={styles.orderItem}>
							<div className={styles.itemInfo}>
								<span className={styles.itemName}>{item.name}</span>
								<span className={styles.itemPrice}>{item.price.toLocaleString('vi-VN')} VNĐ</span>
							</div>
							<div className={styles.itemQuantityControl}>
								<button
									className={styles.quantityButton}
									onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
								>
									-
								</button>
								<span className={styles.itemQuantity}>{item.quantity}</span>
								<button
									className={styles.quantityButton}
									onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
								>
									+
								</button>
								<button
									className={styles.removeItemButton}
									onClick={() => onRemoveOrderItem(item._id)}
								>
									&times;
								</button>
							</div>
						</div>
					))
				)}
			</div>
			<div className={styles.orderSummaryFooter}>
				<div className={styles.summaryRow}>
					<span className={styles.summaryLabel}>Tạm tính ({orderItems.length} món)</span>
					<span className={styles.summaryValue}>
						{total.toLocaleString('vi-VN')} VNĐ
					</span>
				</div>
				<div className={styles.summaryRowTotal}>
					<span className={styles.summaryLabel}>Thành tiền</span>
					<span className={styles.summaryValueTotal}>
						{total.toLocaleString('vi-VN')} VNĐ
					</span>
				</div>
				<div className={styles.actionButtons}>
					<button className={`${styles.actionBtn} ${styles.btnOrder}`}>Gọi món</button>
					<button
						className={`${styles.actionBtn} ${styles.btnPayment}`}
						onClick={() => updateOrder(selectedOrder)}
					>
						Thanh toán
					</button>

				</div>
			</div>
		</div >
	);
};

export default OrderSummary;