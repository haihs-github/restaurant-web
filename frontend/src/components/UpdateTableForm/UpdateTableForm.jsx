import React, { useState, useEffect } from 'react';
import styles from './UpdateTableForm.module.scss';
import axios from 'axios';

function UpdateTableForm({ id, handleHideUpdate, onUserUpdate, fetchTables }) {
	const [formData, setFormData] = useState({
		tableNumber: '',
		capacity: '',
		status: ''
	});
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	// Lấy thông tin bàn theo ID
	const fetchTable = async () => {
		const token = localStorage.getItem('token');
		try {
			const response = await axios.get(`http://localhost:5000/api/tables/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const { table } = response.data;
			setFormData({
				tableNumber: table.tableNumber || '',
				capacity: table.capacity || '',
				status: table.status || '',
			});
		} catch (err) {
			console.error('Lỗi khi lấy thông tin bàn:', err);
			setError('Không thể tải dữ liệu bàn');
		}
	};

	useEffect(() => {
		if (id) {
			fetchTable();
		}
	}, [id]);

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
		try {
			alert('Dữ liệu đang được xử lý');
			const response = await axios.put(`http://localhost:5000/api/tables/${id}`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setMessage(response.data.message);
			alert('Cập nhật bàn thành công');
			onUserUpdate(); // callback để reload danh sách
			handleHideUpdate(); // đóng form
			fetchTables(); // refresh danh sách bàn
		} catch (err) {
			console.error(err);
			if (err.response?.data?.message) {
				setError(err.response.data.message);
			} else {
				setError('Đã xảy ra lỗi khi cập nhật bàn');
			}
		}
	};

	return (
		<div className={styles.UpdateTableFormContainer}>
			<div className={styles.signUpCard}>
				<h2 className={styles.cardTitle}>Chỉnh sửa bàn {formData.tableNumber}</h2>

				{message && <p className={styles.successMessage}>{message}</p>}
				{error && <p className={styles.errorMessage}>{error}</p>}

				<form onSubmit={handleSubmit} className={styles.signUpForm}>
					<div className={styles.formGroup}>
						<input
							type="number"
							name="tableNumber"
							placeholder="Số bàn"
							value={formData.tableNumber}
							onChange={handleChange}
							className={styles.formInput}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<input
							type="number"
							name="capacity"
							placeholder="Sức chứa"
							value={formData.capacity}
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
							<option value="available">-- Chọn trạng thái --</option>
							<option value="available">Đang mở</option>
							<option value="booked">Đang đóng</option>
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

export default UpdateTableForm;
