// features/dishes/DishListPage.jsx
import React, { useEffect, useState } from 'react';
import { getAllDishes, createDish, updateDish, deleteDish } from './dishApi';
import DishListItem from './DishListItem';
import DishForm from './DishForm';
import Header from '../../components/Header'

const DishListPage = () => {
	const [dishes, setDishes] = useState([]);
	const [editingDish, setEditingDish] = useState(null);

	useEffect(() => {
		const fetchDishes = async () => {
			const data = await getAllDishes();
			setDishes(data);
		};
		fetchDishes();
	}, []);

	const handleSubmit = async (formData) => {
		if (editingDish) {
			const updated = await updateDish(editingDish._id, formData);
			setDishes(dishes.map((d) => (d._id === updated._id ? updated : d)));
			setEditingDish(null);
		} else {
			const newDish = await createDish(formData);
			setDishes([...dishes, newDish]);
		}
	};

	const handleDelete = async (id) => {
		if (window.confirm('Xóa món ăn này?')) {
			await deleteDish(id);
			setDishes(dishes.filter((d) => d._id !== id));
		}
	};

	return (
		<div>
			<Header />
			<h2>Quản lý món ăn</h2>
			<DishForm onSubmit={handleSubmit} initialData={editingDish} onCancel={() => setEditingDish(null)} />
			<table>
				<thead>
					<tr>
						<th>Tên</th>
						<th>Giá</th>
						<th>Loại</th>
						<th>Còn phục vụ</th>
						<th>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{dishes.map((dish) => (
						<DishListItem
							key={dish._id}
							dish={dish}
							onEdit={setEditingDish}
							onDelete={handleDelete}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default DishListPage;
