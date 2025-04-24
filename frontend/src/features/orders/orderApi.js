import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

const getTokenConfig = () => {
	const token = localStorage.getItem('token');
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
};

export const getAllOrders = async () => {
	const res = await axios.get(API_URL, getTokenConfig());
	return res.data;
};

export const getOrderDetail = async (id) => {
	const res = await axios.get(`${API_URL}/${id}`, getTokenConfig());
	return res.data;
};

export const createOrder = async (orderData) => {
	const res = await axios.post(API_URL, orderData, getTokenConfig());
	return res.data;
};

export const createOrderClient = async (orderData) => {
	const res = await axios.post(`${API_URL}/client`, orderData);
	return res.data;
};

export const updateOrder = async (id, updateData) => {
	const res = await axios.put(`${API_URL}/${id}`, updateData, getTokenConfig());
	return res.data;
};

export const deleteOrder = async (id) => {
	const res = await axios.delete(`${API_URL}/${id}`, getTokenConfig());
	return res.data;
};