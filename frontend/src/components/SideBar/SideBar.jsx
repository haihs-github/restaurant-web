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
						<Link to="/usermanage">
							<FaUsers className={styles.navIcon} />
							<span>User</span>
							<span className={styles.navBadge}>253</span>
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link href="/dishes">
							<FaLock className={styles.navIcon} />
							<span>Dishes</span>
							<span className={styles.navBadge}>253</span>

						</Link>
					</li>
					<li className={`${styles.navItem}`}>
						<Link to="/tables">
							<FaUsers className={styles.navIcon} />
							<span>Tables</span>
							<span className={styles.navBadge}>253</span>
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/orders">
							<FaUserFriends className={styles.navIcon} />
							<span>Orders</span>
							<span className={styles.navBadge}>22</span>
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link href="/invoices">
							<FaRegFileAlt className={styles.navIcon} />
							<span>Invoices</span>
							<span className={styles.navBadge}>253</span>

						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Sidebar;