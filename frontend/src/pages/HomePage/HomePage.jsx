import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const HomePage = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div>
			<Header />
			<h2>Trang chủ</h2>
		</div>
	);
};

export default HomePage;
