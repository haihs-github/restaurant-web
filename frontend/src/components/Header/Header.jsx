// src/components/Header/Header.jsx (hoặc tương tự)
import styles from './Header.module.scss'; // Import CSS cho component này
import logo from '../../assets/react.svg'; // Đảm bảo đường dẫn đến logo đúng

import { useState } from "react"; // sửa lại đúng tên hook
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';


import Button from '../Button';

function Header() {
	const { user, logout } = useAuth()
	const navigate = useNavigate();

	const handleLogoutBtn = () => {
		logout()
	}

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
			<nav className={styles.headerNav}>
				<ul>
					<li><Link to="/clientOrder">Gọi món</Link></li>
				</ul>
			</nav>
			{/* Thêm phần nút Đăng nhập/Đăng xuất */}
			<div className={styles.userActions}> {/* Áp dụng CSS Module cho div này */}
				{user ? (
					// Nếu đã đăng nhập, hiển thị nút Đăng xuất
					<>

						<div onClick={() => { navigate('/users') }} ><Button content={user.username} /></div>
						<div onClick={handleLogoutBtn} ><Button content="đăng xuất" backgroundColor="red" color="#fff" /></div>
					</>
				) : (
					// Nếu chưa đăng nhập, hiển thị nút Đăng nhập
					<Link to="/login"><Button content="đăng nhập" backgroundColor="#00d8ff" color="#fff" /></Link>
				)}
			</div>
		</header>
	);
};

export default Header;