import React from 'react';
import styles from './OrderSummary.module.scss';

const OrderSummary = ({ orders, onRemoveOrderItem, onQuantityChange, total, selectedTable, setSelectedTable, orderItems }) => {
	const tableOptions = ['Bàn 1', 'Bàn 2', 'Bàn 3', 'Bàn 4']; // Danh sách bàn giả lập

	return (
		<div className={styles.orderSummaryContainer}>
			<div className={styles.orderHeader}>
				<div className={styles.tableSelection}>
					<span className={styles.tableIcon}>&#x268F;</span> {/* Icon bàn */}
					<select
						value={selectedTable}
						onChange={(e) => setSelectedTable(e.target.value)}
						className={styles.tableSelect}
					>
						{tableOptions.map(table => (
							<option key={table} value={table}>{table}</option>
						))}
					</select>
				</div>
				<div className={styles.customerInput}>
					<input type="text" placeholder="Nhập tên hoặc email để tìm kiếm (F4)" className={styles.customerSearchInput} />
					<span className={styles.dropdownIcon}>&#9660;</span>
				</div>
			</div>
			<div className={styles.orderItemsList}>
				{orderItems.length === 0 ? (
					<p className={styles.emptyOrderMessage}>Không có sản phẩm nào trong đơn</p>
				) : (
					orderItems.map((item) => (
						<div key={item.id} className={styles.orderItem}>
							<div className={styles.itemInfo}>
								<span className={styles.itemName}>{item.name}</span>
								<span className={styles.itemPrice}>{item.price.toLocaleString('vi-VN')} VNĐ</span>
							</div>
							<div className={styles.itemQuantityControl}>
								<button
									className={styles.quantityButton}
									onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
								>
									-
								</button>
								<span className={styles.itemQuantity}>{item.quantity}</span>
								<button
									className={styles.quantityButton}
									onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
								>
									+
								</button>
								<button
									className={styles.removeItemButton}
									onClick={() => onRemoveOrderItem(item.id)}
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
				<div className={styles.summaryRow}>
					<span className={styles.summaryLabel}>Thuế hóa đơn</span>
					<span className={styles.summaryValue}>0 VNĐ</span> {/* Giả lập thuế */}
				</div>
				<div className={styles.summaryRowTotal}>
					<span className={styles.summaryLabel}>Thành tiền</span>
					<span className={styles.summaryValueTotal}>
						{total.toLocaleString('vi-VN')} VNĐ
					</span>
				</div>
				<div className={styles.actionButtons}>
					<button className={`${styles.actionBtn} ${styles.btnOrder}`}>Gọi món</button>
					<button className={`${styles.actionBtn} ${styles.btnPayment}`}>Thanh toán</button>
				</div>
			</div>
		</div>
	);
};

export default OrderSummary;