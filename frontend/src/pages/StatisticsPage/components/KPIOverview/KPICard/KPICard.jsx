import React from 'react';
import styles from './KPICard.module.scss';

function KPICard({ title, value, }) {

	return (
		<div className={styles.kpiCard}>
			<div className={styles.kpiTitle}>{title}</div>
			<div className={styles.kpiValue}>{value}</div>
			<div className={styles.kpiValue}>Đơn</div>
		</div>
	);
}

export default KPICard;