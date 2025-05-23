import React from 'react';
import styles from './ProductGrid.module.scss';

const ProductGrid = ({ dishes, selectedCategory, onAddOrderItem }) => {
	const filteredDishes = selectedCategory === 'all'
		? dishes
		: dishes.filter(dish => dish.category_id.name === selectedCategory);

	return (
		<div className={styles.productGridContainer}>
			<div className={styles.productList}>
				{filteredDishes.map((dish) => (
					<div key={dish.id} className={styles.productCard} onClick={() => onAddOrderItem(dish)}>
						<div className={styles.productImageWrapper}>
							<img src={dish.thumbnail} alt={dish.name} className={styles.productImage} />
						</div>
						<div className={styles.productInfo}>
							<p className={styles.productName}>{dish.name}</p>
							<p className={styles.productPrice}>{dish.price.toLocaleString('vi-VN')} VNĐ</p>
						</div>
					</div>
				))}
				{filteredDishes.length === 0 && (
					<p className={styles.noProductsMessage}>Không có sản phẩm nào trong danh mục này.</p>
				)}
			</div>
		</div>
	);
};

export default ProductGrid;