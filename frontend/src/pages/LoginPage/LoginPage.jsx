import Button from '../../components/Button';
import Header from '../../components/Header'
import styles from './LoginPage.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // Đường dẫn đúng theo dự án của bạn

function LoginPage() {
	const { login, user } = useAuth();
	const [formData, setFormData] = useState({ username: '', password: '' });
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	function decodeJWT(token) {
		if (!token) return null;

		try {
			// JWT có 3 phần: header.payload.signature, ta cần phần payload (giữa)
			const payloadBase64 = token.split('.')[1];
			if (!payloadBase64) return null;

			// Thay các ký tự base64 URL safe thành chuẩn base64 thường
			const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');

			// Giải mã base64 => chuỗi JSON
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split('')
					.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
					.join('')
			);

			// Parse JSON payload ra object
			return JSON.parse(jsonPayload);
		} catch (error) {
			console.error("Lỗi decode JWT:", error);
			return null;
		}
	}

	const handleSubmit = async (e) => {
		localStorage.removeItem('token')
		e.preventDefault();
		try {
			const res = await axios.post('http://localhost:5000/api/auth/login', formData);
			const decoded = decodeJWT(res.data.token); // Tự gọi decode để lấy thông tin user ngay
			login(res.data.token); // Lưu token
			alert('Đăng nhập thành công!');
			if (decoded.role === "admin") {
				navigate('/users');
			} else {
				navigate('/');
			}
		} catch (err) {
			alert(err.response?.data?.message || 'Đăng nhập thất bại');
		}
	};

	return (<>
		<Header />
		<div className={styles.authPageContainer}>
			<div className={styles.authCard}>
				<h2 className={styles.authCardTitle}>Chào mừng quay lại</h2>

				<form onSubmit={handleSubmit} className={styles.authForm}>
					<div className={styles.formGroup}>
						<input
							type="text"
							id="username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							placeholder="Tên tài khoản"
							className={styles.formInput}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Mật khẩu"
							className={styles.formInput}
							required
						/>
					</div>
					<Button type="submit" content="Đăng nhập" backgroundColor="#00d8ff" color="#fff" />
				</form>

				<p className={styles.authCardFooter}>
					Không có tài khoản{" "}
					<Link to="/register" className={styles.signupLink}>Đăng ký ngay!</Link>
				</p>
			</div>
		</div>
	</>
	);
}

export default LoginPage;