import styles from './Sidebar.module.scss';

const Sidebar = ({
	activeTab, setActiveTab, selectedCategory, onCategoryChange, categories
}) => {
	return (
		<aside className={styles.sidebar}>
			<div className={styles.tabs}>
				<button
					className={`${styles.tabButton} ${activeTab === 'menu' ? styles.active : ''}`}
					onClick={() => setActiveTab('menu')}
				>
					Thực đơn
				</button>
			</div>

			<div className={styles.categoryFilter}>
				<button
					className={`${styles.categoryButton} ${selectedCategory === 'all' ? styles.active : ''}`}
					onClick={() => onCategoryChange('all')}
				>
					Tất cả
				</button>

				{categories.map((item, index) => (
					<button
						key={index}
						className={`${styles.categoryButton} ${selectedCategory === item.name ? styles.active : ''}`}
						onClick={() => onCategoryChange(item.name)}
					>
						{item.name}
					</button>
				))}
			</div>
		</aside>
	);
};

export default Sidebar;
