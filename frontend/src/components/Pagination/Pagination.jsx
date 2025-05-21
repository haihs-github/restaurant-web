// src/components/Pagination/Pagination.jsx
import React from 'react';
import styles from './Pagination.module.scss';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	const pages = [];
	for (let i = 1; i <= totalPages; i++) {
		pages.push(i);
	}

	return (
		<div className={styles.paginationContainer}>
			<button
				className={`${styles.paginationButton} ${styles.prevNextButton}`}
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				Previous
			</button>
			{pages.map(page => (
				<button
					key={page}
					className={`${styles.paginationButton} ${page === currentPage ? styles.active : ''}`}
					onClick={() => onPageChange(page)}
				>
					{page}
				</button>
			))}
			<button
				className={`${styles.paginationButton} ${styles.prevNextButton}`}
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				Next
			</button>
		</div>
	);
};

export default Pagination;