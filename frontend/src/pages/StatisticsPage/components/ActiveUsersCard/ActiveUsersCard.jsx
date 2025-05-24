import React from 'react';
import styles from './ActiveUsersCard.module.scss';
import { FaArrowRight } from 'react-icons/fa'; // Assuming you have react-icons installed
import { Link } from 'react-router-dom';

function ActiveUsersCard({ activeUsers, content }) {
	return (
		<div className={styles.activeUsersCard}>
			<h3 className={styles.cardTitle}>{content}</h3>
			<div className={styles.activeUsersCount}>{activeUsers || 0}</div>
			<Link to="/orders" className={styles.viewReferralsButton}>
				Xem toàn bộ đơn đặt bàn <FaArrowRight className={styles.arrowIcon} />
			</Link>
		</div>
	);
}

export default ActiveUsersCard;