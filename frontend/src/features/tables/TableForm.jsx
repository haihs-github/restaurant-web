import React, { useState, useEffect } from "react";

const TableForm = ({ initialData = null, onSubmit }) => {
	const [tableNumber, setTableNumber] = useState("");
	const [capacity, setCapacity] = useState("");
	const [status, setStatus] = useState("available");

	useEffect(() => {
		if (initialData) {
			setTableNumber(initialData.tableNumber);
			setCapacity(initialData.capacity);
			setStatus(initialData.status || "available");
		}
	}, [initialData]);

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({ tableNumber, capacity, status });
		setTableNumber("");
		setCapacity("");
		setStatus("available");
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="number"
				placeholder="Số bàn"
				value={tableNumber}
				onChange={(e) => setTableNumber(Number(e.target.value))}
				required
			/>
			<input
				type="number"
				placeholder="Sức chứa"
				value={capacity}
				onChange={(e) => setCapacity(Number(e.target.value))}
				required
			/>
			<select value={status} onChange={(e) => setStatus(e.target.value)}>
				<option value="available">Trống</option>
				<option value="booked">Đã đặt</option>
				<option value="in_service">Đang phục vụ</option>
			</select>
			<button type="submit">{initialData ? "Cập nhật" : "Thêm bàn"}</button>
		</form>
	);
};

export default TableForm;
