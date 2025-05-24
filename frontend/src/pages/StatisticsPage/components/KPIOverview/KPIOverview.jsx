import React from 'react';
import styles from './KPIOverview.module.scss';
import KPICard from './KPICard/KPICard';

function KPIOverview({ statusCount }) {
	// Chuyển object thành mảng các object { key, value }
	const statusArray = Object.entries(statusCount).map(([key, value]) => ({
		key,
		value
	}));

	// Mapping key sang tên tiếng Việt
	const statusName = {
		pending: 'Chờ xác nhận',
		confirmed: 'Đã xác nhận',
		completed: 'Hoàn tất',
		rejected: 'Đã từ chối'
	};

	return (
		<div className={styles.kpiOverviewContainer}>
			{statusArray.map((status, index) => (
				<KPICard
					key={index}
					title={statusName[status.key] || status.key} // fallback nếu thiếu key
					value={status.value}
				/>
			))}
		</div>
	);
}

export default KPIOverview;
