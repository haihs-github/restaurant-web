import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./RegisterPage.module.scss";
import Header from '../../components/Header'

const RegisterForm = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		username: "",
		password: "",
		confirmPassword: "",
		fullname: "",
		email: "",
		phone: "",
		role: "staff",
	});
	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (form.password !== form.confirmPassword) {
			setMessage("❌ Mật khẩu xác nhận không khớp");
			return;
		}

		try {
			const res = await axios.post("http://localhost:5000/api/auth/register", {
				username: form.username,
				password: form.password,
				fullname: form.fullname,
				email: form.email,
				phone: form.phone,
				role: form.role,
			});
			setMessage("✅ Đăng ký thành công, chuyển về đăng nhập...");
			setTimeout(() => navigate("/login"), 1500);
		} catch (err) {
			console.log('loi:', err.message)
			setMessage(`❌ ${err.response?.data?.message || "Lỗi đăng ký"}`);
		}
	};

	return (
		<>
			<Header />
			<div className={styles.container}>
				<h2>Đăng ký tài khoản</h2>
				<form onSubmit={handleSubmit} className={styles.form}>
					<input type="text" name="username" placeholder="Tên đăng nhập" onChange={handleChange} required />
					<input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
					<input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" onChange={handleChange} required />
					<input type="text" name="fullname" placeholder="Họ tên" onChange={handleChange} required />
					<input type="email" name="email" placeholder="Email" onChange={handleChange} required />
					<input type="text" name="phone" placeholder="SĐT" onChange={handleChange} required />
					<select name="role" onChange={handleChange}>
						<option value="staff">Nhân viên</option>
						<option value="admin">Quản lý</option>
					</select>
					<button type="submit">Đăng ký</button>
				</form>
				{message && <p className={styles.message}>{message}</p>}
			</div>
		</>
	);
};

export default RegisterForm;
