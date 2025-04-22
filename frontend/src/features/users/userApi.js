// features/users/userApi.js
import axios from 'axios';

// Hàm để lấy token từ localStorage và tạo header
const authHeader = () => {
	const token = localStorage.getItem('token');
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
};

// Lấy danh sách tất cả user (chỉ cho admin)
export const getAllUsers = async () => {
	const response = await axios.get('http://localhost:5000/api/users', authHeader());
	console.log('response', response.data)
	return response.data;
};

// Xoá user theo ID
export const deleteUser = async (id) => {
	const response = await axios.delete(`http://localhost:5000/api/users/${id}`, authHeader());
	return response.data;
};

// Cập nhật thông tin user
export const updateUser = async (id, data) => {
	const response = await axios.put(`http://localhost:5000/api/users/${id}`, data, authHeader());
	return response.data;
};
