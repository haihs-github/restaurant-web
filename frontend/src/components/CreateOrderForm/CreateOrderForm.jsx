import { useState, useEffect } from 'react';
import styles from './CreateOrderForm.module.scss';
import axios from 'axios';

function CreateOrderForm({ handleHideRegister, onOrderCreated }) {
	const [formData, setFormData] = useState({
		table_id: '',
		customerName: '',
		customerPhone: '',
		emailCustomer: '',
	});
	const [tables, setTables] = useState([]);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

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

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage('');
		setError('');
		const token = localStorage.getItem('token');
		console.log('Form data', formData)
		try {
			const response = await axios.post('http://localhost:5000/api/orders', formData);
			setFormData({
				table_id: '',
				customerName: '',
				customerPhone: '',
				emailCustomer: '',
			});
			console.log('response', response)
			onOrderCreated(); // callback cập nhật UI nếu cần
			setMessage(response.data.message);
			handleHideRegister();
			alert('Tạo đơn đặt bàn thành công');
		} catch (err) {
			if (err.response && err.response.data && err.response.data.message) {
				setError(err.response.data.message);
			} else {
				setError('Đã xảy ra lỗi khi tạo đơn đặt bàn');
			}
		}
	};

	return (
		<div className={styles.CreateOrderFormContainer}>
			<div className={styles.signUpCard}>
				<h2 className={styles.cardTitle}>Tạo đơn đặt bàn</h2>

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

					<div className={styles.formGroup}>
						<input
							type="text"
							name="customerName"
							placeholder="Tên khách hàng"
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
							placeholder="Số điện thoại"
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
							placeholder="Email khách hàng"
							value={formData.emailCustomer}
							onChange={handleChange}
							className={styles.formInput}
							required
						/>
					</div>

					<button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
						Tạo đơn
					</button>
					<button
						onClick={handleHideRegister}
						type="button"
						className={`${styles.btn} ${styles.btnDelete}`}
					>
						Hủy
					</button>
				</form>
			</div>
		</div>
	);
}

export default CreateOrderForm;
