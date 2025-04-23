import axios from "axios";

const API_URL = "http://localhost:5000/api/tables";
const token = localStorage.getItem("token");

const authHeaders = {
	headers: {
		Authorization: `Bearer ${token}`,
	},
};

export const getAllTables = async () => {
	const res = await axios.get(API_URL);
	return res.data;
};

export const createTable = async (data) => {
	const res = await axios.post(API_URL, data, authHeaders);
	return res.data;
};

export const updateTable = async (id, data) => {
	const res = await axios.put(`${API_URL}/${id}`, data, authHeaders);
	return res.data;
};

export const deleteTable = async (id) => {
	const res = await axios.delete(`${API_URL}/${id}`, authHeaders);
	return res.data;
};
