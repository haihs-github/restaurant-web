// features/dishes/DishListItem.jsx
import React from 'react';

const DishListItem = ({ dish, onEdit, onDelete }) => {
	return (
		<tr>
			<td>{dish.name}</td>
			<td>{dish.price}</td>
			<td>{dish.category}</td>
			<td>{dish.isAvailable ? '✔️' : '❌'}</td>
			<td>
				<button onClick={() => onEdit(dish)}>Sửa</button>
				<button onClick={() => onDelete(dish._id)}>Xóa</button>
			</td>
		</tr>
	);
};

export default DishListItem;
