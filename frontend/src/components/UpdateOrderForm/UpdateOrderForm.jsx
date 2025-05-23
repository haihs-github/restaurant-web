import { useState, useEffect } from 'react';
import styles from './UpdateOrderForm.module.scss';
import axios from 'axios';

function UpdateOrderForm({ id, handleHideUpdate, onOrderUpdate, fetchOrders }) {
	const [formData, setFormData] = useState({
		table_id: '',
		status: '',
		customerName: '',
		customerPhone: '',
		emailCustomer: ''
	});
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	// Lấy thông tin đơn hàng theo ID
	const fetchOrder = async () => {
		try {
			const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			const { order } = response.data;
			setFormData({
				table_id: order.table_id,
				orderTime: order.orderTime,
				status: order.status,
				customerName: order.customerName,
				customerPhone: order.customerPhone,
				emailCustomer: order.emailCustomer
			});
		} catch (err) {
			console.error('Lỗi khi lấy thông tin đơn hàng:', err);
			setError('Không thể tải dữ liệu đơn hàng');
		}
	};
	useEffect(() => {
		if (id) {
			fetchOrder();
		}
	}, [id]);

	// Xử lý thay đổi input
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// Gửi request cập nhật order
	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage('');
		setError('');
		const token = localStorage.getItem('token');
		try {
			const response = await axios.put(`http://localhost:5000/api/orders/${id}`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setMessage(response.data.message);
			alert('Cập nhật order thành công');
			onOrderUpdate(); // callback để reload danh sách
			handleHideUpdate(); // đóng form
			fetchOrders()
		} catch (err) {
			console.error(err);
			if (err.response?.data?.message) {
				setError(err.response.data.message);
			} else {
				setError('Đã xảy ra lỗi khi cập nhật order');
			}
		}
	};

	const [tables, setTables] = useState([]);

	// Lấy danh sách bàn có sẵn để người dùng chọn
	useEffect(() => {
		const fetchTables = async () => {
			try {
				const res = await axios.get('http://localhost:5000/api/tables');
				const availableTables = (res.data.tables || []).filter(
					(table) => table.status === 'available'
				);
				setTables(availableTables); // giả sử API trả về { tables: [...] }
			} catch (err) {
				console.error('Lỗi khi lấy danh sách bàn:', err);
			}
		};
		fetchTables();
	}, []);

	return (
		<div className={styles.UpdateOrderFormContainer}>
			<div className={styles.signUpCard}>
				<h2 className={styles.cardTitle}>Chỉnh sửa order</h2>

				{message && <p className={styles.successMessage}>{message}</p>}
				{error && <p className={styles.errorMessage}>{error}</p>}

				<form onSubmit={handleSubmit} className={styles.signUpForm}>
					<div className={styles.formGroup}>
						<select
							name="table_id"
							value={formData.table_id}
							onChange={handleChange}
							className={styles.formSelect}
							required
						>
							<option value="">Chọn bàn</option>
							{tables.map((table) => (
								<option key={table._id} value={table._id}>
									Bàn {table.tableNumber} (Sức chứa: {table.capacity})
								</option>
							))}
						</select>
					</div>

					{/* Ô input nhập ngày mới */}
					<div className={styles.formGroup}>
						<input
							type="date"
							name="orderTime"
							value={formData.orderTime} // Đảm bảo formData của bạn có thuộc tính này
							onChange={handleChange}
							className={styles.formInput}
							min={new Date().toISOString().split('T')[0]}
							required
						/>
					</div>

					<div className={styles.formGroup}>
						<input
							type="text"
							name="customerName"
							placeholder="Họ tên"
							value={formData.customerName}
							onChange={handleChange}
							className={styles.formInput}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<input
							type="text"
							name="customerPhone"
							placeholder="SĐT"
							value={formData.customerPhone}
							onChange={handleChange}
							className={styles.formInput}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<input
							type="email"
							name="emailCustomer"
							placeholder="Email (Ví dụ: abc@gmail.com)" // Sửa placeholder cho đúng với email
							value={formData.emailCustomer} // Giả sử bạn đang dùng formData.emailCustomer cho email
							onChange={handleChange}
							className={styles.formInput}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<select
							name="status"
							value={formData.status}
							onChange={handleChange}
							className={styles.formSelect}
							required
						>
							<option value="pending">Đang chờ</option>
							<option value="confirmed">Đã xác nhận</option>
							<option value="completed">Đã hoàn tất</option>
							<option value="rejected">Đã Hủy</option>
						</select>
					</div>

					<button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
						Cập nhật
					</button>
					<button onClick={handleHideUpdate} type="button" className={`${styles.btn} ${styles.btnDelete}`}>
						Hủy
					</button>
				</form>
			</div>
		</div>
	);
}

export default UpdateOrderForm;