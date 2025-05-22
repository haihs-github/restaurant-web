// src/components/CreateTableForm/CreateTableForm.jsx
import { useState } from 'react';
import styles from './CreateTableForm.module.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

function CreateTableForm({ handleHideRegister, onUserCreated }) {

	const [formData, setFormData] = useState({
		tableNumber: "",
		capacity: "",
		status: 'available',
	});
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

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
			alert('Đang xử lý dữ liệu')
			const response = await axios.post('http://localhost:5000/api/tables', formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setMessage(response.data.message);
			setFormData({
				tableNumber: '',
				capacity: 1,
				status: 'available',
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
			<div className={styles.CreateTableFormContainer}>
				<div className={styles.signUpCard}>
					<h2 className={styles.cardTitle}>Tạo Bàn</h2>

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

						<button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
							Tạo bàn
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

export default CreateTableForm;
