import React from 'react';
import styles from './TabsNavigation.module.scss';

function TabsNavigation({ tabs, activeTab, onTabChange }) {
	return (
		<nav className={styles.tabsNavigation}>
			<ul className={styles.tabList}>
				{tabs.map((tab) => (
					<li
						key={tab}
						className={`${styles.tabItem} ${activeTab === tab ? styles.activeTab : ''}`}
						onClick={() => onTabChange(tab)}
					>
						{tab}
					</li>
				))}
			</ul>
		</nav>
	);
}

export default TabsNavigation;