import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("http://localhost:5000/api/auth/login", {
				username,
				password
			});
			login({ username, role: res.data.role }, res.data.token);
			alert("Đăng nhập thành côngcông!");
			navigate("/");
		} catch (err) {
			alert("Đăng nhập thất bại: " + err.response?.data?.message || err.message);
		}
	};

	return (
		<div>
			<Header />
			<h2>Đăng nhập</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Tên đăng nhập"
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Mật khẩu"
				/>
				<button type="submit">Đăng nhập</button>
			</form>
		</div>
	);
}

export default LoginPage;
