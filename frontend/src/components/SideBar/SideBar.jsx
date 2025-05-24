// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import styles from './Sidebar.module.scss';
import { FaUserCircle, FaHome, FaUsers, FaUserFriends, FaRegFileAlt, FaLock, FaChartBar } from 'react-icons/fa';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
// Cần cài đặt react-icons: npm install react-icons

const Sidebar = () => {
	const { user } = useAuth()

	return (
		<div className={styles.sidebarContainer}>
			<div className={styles.profileSection}>
				<FaUserCircle className={styles.profileAvatar} />
				<div className={styles.profileInfo}>
					<span className={styles.profileName}>{user.username}</span>
				</div>
			</div>

			<div className={styles.sectionTitle}>Quản lý </div>

			<nav className={styles.mainNav}>
				<ul>
					<li className={styles.navItem}>
						<Link to="/users">
							<FaUsers className={styles.navIcon} />
							<span>Nhân viên</span>
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/dishes">
							<FaLock className={styles.navIcon} />
							<span>Món ăn</span>

						</Link>
					</li>
					<li className={`${styles.navItem}`}>
						<Link to="/tables">
							<FaUsers className={styles.navIcon} />
							<span>Bàn ăn</span>
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/orders">
							<FaUserFriends className={styles.navIcon} />
							<span>Đơn đặt bàn</span>
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/statictis">
							<FaRegFileAlt className={styles.navIcon} />
							<span>Thống kê</span>

						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Sidebar;