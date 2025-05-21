import React, { useState, useEffect } from 'react';
import styles from './UpdateUserForm.module.scss';
import axios from 'axios';

function UpdateUserForm({ id, handleHideUpdate, onUserUpdate, fetchUsers }) {
	const [formData, setFormData] = useState({
		fullname: '',
		email: '',
		phone: '',
		role: 'staff',
	});
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	// Lấy thông tin người dùng theo ID
	const fetchUser = async () => {
		const token = localStorage.getItem('token');
		try {
			const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const { user } = response.data;
			setFormData({
				fullname: user.fullname || '',
				email: user.email || '',
				phone: user.phone || '',
				role: user.role || 'staff',
			});
		} catch (err) {
			console.error('Lỗi khi lấy thông tin người dùng:', err);
			setError('Không thể tải dữ liệu người dùng');
		}
	};
	useEffect(() => {
		if (id) {
			fetchUser();
		}
	}, [id]);

	// Xử lý thay đổi input
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// Gửi request cập nhật người dùng
	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage('');
		setError('');
		const token = localStorage.getItem('token');
		try {
			const response = await axios.put(`http://localhost:5000/api/users/${id}`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setMessage(response.data.message);
			alert('Cập nhật người dùng thành công');
			onUserUpdate(); // callback để reload danh sách
			handleHideUpdate(); // đóng form
			fetchUsers()
		} catch (err) {
			console.error(err);
			if (err.response?.data?.message) {
				setError(err.response.data.message);
			} else {
				setError('Đã xảy ra lỗi khi cập nhật người dùng');
			}
		}
	};

	return (
		<div className={styles.UpdateUserFormContainer}>
			<div className={styles.signUpCard}>
				<h2 className={styles.cardTitle}>Chỉnh sửa người dùng</h2>

				{message && <p className={styles.successMessage}>{message}</p>}
				{error && <p className={styles.errorMessage}>{error}</p>}

				<form onSubmit={handleSubmit} className={styles.signUpForm}>
					<div className={styles.formGroup}>
						<input
							type="text"
							name="fullname"
							placeholder="Họ tên"
							value={formData.fullname}
							onChange={handleChange}
							className={styles.formInput}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<input
							type="email"
							name="email"
							placeholder="Email"
							value={formData.email}
							onChange={handleChange}
							className={styles.formInput}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<input
							type="text"
							name="phone"
							placeholder="Số điện thoại"
							value={formData.phone}
							onChange={handleChange}
							className={styles.formInput}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<select
							name="role"
							value={formData.role}
							onChange={handleChange}
							className={styles.formSelect}
							required
						>
							<option value="staff">Nhân viên</option>
							<option value="admin">Quản lý</option>
						</select>
					</div>

					<button type="submit" onClick={onUserUpdate} className={`${styles.btn} ${styles.btnPrimary}`}>
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

export default UpdateUserForm;
