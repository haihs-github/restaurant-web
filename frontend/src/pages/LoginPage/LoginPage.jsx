import Button from '../../components/Button';
import Header from '../../components/Header'
import styles from './LoginPage.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // Đường dẫn đúng theo dự án của bạn

function LoginPage() {
	const { login } = useAuth();
	const [formData, setFormData] = useState({ username: '', password: '' });
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post('http://localhost:5000/api/auth/login', formData);
			login(res.data.token); // ✅ Gọi hàm login của AuthContext
			alert('Đăng nhập thành công!');
			if (window.history.length > 1) {
				navigate(-1); // quay lại trang trước nếu có
			} else {
				navigate('/'); // hoặc chuyển hướng về trang đăng nhập
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