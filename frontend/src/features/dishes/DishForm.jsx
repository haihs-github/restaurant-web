// features/dishes/DishForm.jsx
import React, { useState, useEffect } from 'react';

const DishForm = ({ onSubmit, initialData = {}, onCancel }) => {
	const [formData, setFormData] = useState({
		name: '',
		price: '',
		description: '',
		category: '',
		isAvailable: true,
	});

	useEffect(() => {
		if (initialData) setFormData(initialData);
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input name="name" placeholder="Tên món" value={formData.name} onChange={handleChange} required />
			<input name="price" type="number" placeholder="Giá" value={formData.price} onChange={handleChange} required />
			<input name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} />
			<input name="category" placeholder="Loại món" value={formData.category} onChange={handleChange} />
			<label>
				<input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
				Còn phục vụ?
			</label>
			<button type="submit">Lưu</button>
			{onCancel && <button type="button" onClick={onCancel}>Hủy</button>}
		</form>
	);
};

export default DishForm;
