import React from 'react';
import styles from './PageViewsChart.module.scss';
import { FaArrowRight } from 'react-icons/fa';
// import { Bar } from 'react-chartjs-2'; // If using react-chartjs-2
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function PageViewsChart() {
	// Dummy data for the chart (replace with actual data and chart library integration)
	const chartData = {
		labels: Array(20).fill(''), // Just placeholders for bars
		datasets: [
			{
				data: [10, 20, 15, 25, 30, 22, 18, 35, 40, 30, 25, 12, 18, 28, 33, 20, 15, 22, 28, 35],
				backgroundColor: '#607d8b', // A greyish color for bars
				borderRadius: 2,
				barThickness: 5,
				maxBarThickness: 8,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				enabled: true, // You'd customize this to match the image's tooltip
				mode: 'index',
				intersect: false,
				backgroundColor: 'rgba(0,0,0,0.8)',
				titleColor: '#fff',
				bodyColor: '#fff',
				callbacks: {
					label: function (context) {
						return `${context.parsed.y} page views`;
					},
					title: function (context) {
						// This is simplified, you'd calculate actual time based on data
						return '3 min ago';
					}
				}
			},
		},
		scales: {
			x: {
				display: false, // Hide x-axis
			},
			y: {
				display: false, // Hide y-axis
			},
		},
	};

	return (
		<div className={styles.pageViewsChartCard}>
			<h3 className={styles.cardTitle}>Page views per minutes</h3>
			<div className={styles.chartArea}>
				{/*
          <Bar data={chartData} options={chartOptions} />
          You would place your actual chart component here (e.g., from react-chartjs-2)
        */}
				<div className={styles.dummyChartBars}>
					{chartData.datasets[0].data.map((value, index) => (
						<div key={index} className={styles.bar} style={{ height: `${value * 1.5}px` }}></div>
					))}
				</div>
				<div className={styles.tooltipExample}>
					<div className={styles.tooltipValue}>48 page views</div>
					<div className={styles.tooltipTime}>3 min ago</div>
				</div>
			</div>
			<button className={styles.viewReferralsButton}>
				VIEW REFERRALS <FaArrowRight className={styles.arrowIcon} />
			</button>
		</div>
	);
}

export default PageViewsChart;