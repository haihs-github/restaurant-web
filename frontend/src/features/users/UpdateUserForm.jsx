// features/users/UpdateUserForm.jsx
import React, { useState, useEffect } from 'react';

const UpdateUserForm = ({ user, onSubmit, onCancel }) => {
	const [formData, setFormData] = useState(user);

	// Cập nhật form khi user thay đổi
	useEffect(() => {
		setFormData(user);
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<div>
			<h3>Sửa thông tin người dùng</h3>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="fullname">Họ tên</label>
					<input
						id="fullname"
						type="text"
						name="fullname"
						value={formData.fullname}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="role">Vai trò</label>
					<select
						id="role"
						name="role"
						value={formData.role}
						onChange={handleChange}
					>
						<option value="admin">Admin</option>
						<option value="staff">Staff</option>
					</select>
				</div>
				<div>
					<label htmlFor="isAvailable">Trạng thái</label>
					<select
						id="isAvailable"
						name="isAvailable"
						value={formData.isAvailable}
						onChange={handleChange}
					>
						<option value="true">đang làm</option>
						<option value="false">đã nghỉ</option>
					</select>
				</div>
				<button type="submit">Lưu</button>
				<button type="button" onClick={onCancel}>Hủy</button>
			</form>
		</div>
	);
};

export default UpdateUserForm;
