// src/components/Header/Header.jsx (hoặc tương tự)
import styles from './Header.module.scss'; // Import CSS cho component này
import logo from '../../assets/react.svg'; // Đảm bảo đường dẫn đến logo đúng

import { useState } from "react"; // sửa lại đúng tên hook
import { Link } from "react-router-dom";

import Button from '../Button';

function Header() {

	const [isLoggedIn, setIsLoggedIn] = useState(false)

	return (
		<header className={styles.mainHeader}>
			<div className="headerLogo">
				<img src={logo} alt="Codi House Logo" />
			</div>
			<nav className={styles.headerNav}>
				<ul>
					<li><Link to="/">Trang Chủ</Link></li>
				</ul>
			</nav>
			{/* Thêm phần nút Đăng nhập/Đăng xuất */}
			<div className={styles.userActions}> {/* Áp dụng CSS Module cho div này */}
				{isLoggedIn ? (
					// Nếu đã đăng nhập, hiển thị nút Đăng xuất
					<Button content="đăng xuất" backgroundColor="red" color="#fff" />
				) : (
					// Nếu chưa đăng nhập, hiển thị nút Đăng nhập
					<Button content="đăng nhập" backgroundColor="#00d8ff" color="#fff" />

				)}
			</div>
		</header>
	);
};

export default Header;