// features/dishes/dishApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dishes';

const getAuthHeaders = () => {
	const token = localStorage.getItem('token');
	return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllDishes = async () => {
	const res = await axios.get(API_URL);
	return res.data;
};

export const createDish = async (dishData) => {
	const res = await axios.post(API_URL, dishData, {
		headers: getAuthHeaders(),
	});
	return res.data;
};

export const updateDish = async (id, dishData) => {
	const res = await axios.put(`${API_URL}/${id}`, dishData, {
		headers: getAuthHeaders(),
	});
	return res.data;
};

export const deleteDish = async (id) => {
	const res = await axios.delete(`${API_URL}/${id}`, {
		headers: getAuthHeaders(),
	});
	return res.data;
};
