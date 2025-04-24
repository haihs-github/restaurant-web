import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Header.module.scss";

const Header = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<header className={styles.header}>
			<div className={styles.logo}>
				<Link to="/">🍽️ Quản lý nhà hàng</Link>
			</div>
			<nav className={styles.nav}>
				<>
					<Link to="/">Trang chủ</Link>
					<Link to="/tables">Bàn ăn</Link>
					<Link to="/dishes">Món ăn</Link>
					{user && <Link to="/orders">Đơn hàng</Link>}
					{user && <Link to="/users">Quản lý nhân viên</Link>}
					{user && <Link to="/invoices">Hóa đơn</Link>}
				</>
			</nav>
			<div className={styles.auth}>
				{user ? (
					<>
						<span>{user.username} ({user.role})</span>
						<button onClick={handleLogout}>Đăng xuất</button>
					</>
				) : (
					<>
						<Link to="/login">Đăng nhập</Link>
						<Link to="/register">Đăng ký</Link>
					</>
				)}
			</div>
		</header>
	);
};

export default Header;
