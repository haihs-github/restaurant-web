// src/components/RegisterPage/RegisterPage.jsx
import React, { useState } from 'react';
import styles from './RegisterPage.module.scss';
import Header from '../../components/Header';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'

function RegisterPage({ handleHideRegister, onUserCreated }) {

	const [formData, setFormData] = useState({
		username: '',
		email: '',
		phone: '',
		fullname: '',
		password: '',
		confirmPassword: '',
		role: 'staff',
	});
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

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
		const token = localStorage.getItem('token')
		try {
			const response = await axios.post('http://localhost:5000/api/auth/register', formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setMessage(response.data.message);
			setFormData({
				username: '',
				email: '',
				phone: '',
				fullname: '',
				password: '',
				confirmPassword: '',
				role: 'staff',
			});
			onUserCreated();
			handleHideRegister()
			alert('Tạo tài khoản thành công')
		} catch (err) {
			if (err.response && err.response.data && err.response.data.message) {
				setError(err.response.data.message);
			} else {
				setError('Đã xảy ra lỗi khi tạo tài khoản');
			}
		}
	};

	return (
		<>
			<div className={styles.RegisterPageContainer}>
				<div className={styles.signUpCard}>
					<h2 className={styles.cardTitle}>Tạo tài khoản mới</h2>

					{message && <p className={styles.successMessage}>{message}</p>}
					{error && <p className={styles.errorMessage}>{error}</p>}

					<form onSubmit={handleSubmit} className={styles.signUpForm}>
						<div className={styles.formGroup}>
							<input
								type="text"
								name="username"
								placeholder="Tên tài khoản"
								value={formData.username}
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
								type="password"
								name="password"
								placeholder="Mật khẩu"
								value={formData.password}
								onChange={handleChange}
								className={styles.formInput}
								required
							/>
						</div>
						<div className={styles.formGroup}>
							<input
								type="password"
								name="confirmPassword"
								placeholder="Nhập lại mật khẩu"
								value={formData.confirmPassword}
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
								<option value="staff" disabled>Chọn vai trò</option>
								<option value="staff">Nhân viên</option>
								<option value="admin">Quản lý</option>
							</select>
						</div>

						<button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
							Tạo tài khoản
						</button>
						<button onClick={handleHideRegister} type="button" className={`${styles.btn} ${styles.btnDelete}`}>
							Hủy
						</button>
					</form>
				</div>
			</div>
		</>
	);
}

export default RegisterPage;
