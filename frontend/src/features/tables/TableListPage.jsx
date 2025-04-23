import React, { useEffect, useState } from "react";
import { getAllTables, createTable, updateTable, deleteTable } from "./tableApi";
import Header from "../../components/Header";
import TableForm from "./TableForm";

const TableListPage = () => {
	const [tables, setTables] = useState([]);
	const [editingTable, setEditingTable] = useState(null);

	const fetchTables = async () => {
		const data = await getAllTables();
		setTables(data.filter(t => t.isAvailable));
	};

	useEffect(() => {
		fetchTables();
	}, []);

	const handleCreate = async (tableData) => {
		await createTable(tableData);
		await fetchTables();
	};

	const handleUpdate = async (id, tableData) => {
		await updateTable(id, tableData);
		await fetchTables();
		setEditingTable(null);
	};

	const handleDelete = async (id) => {
		if (window.confirm("Bạn có chắc muốn xoá bàn này không?")) {
			await deleteTable(id);
			await fetchTables();
		}
	};

	return (
		<div>
			<Header />
			<h2>Danh sách bàn</h2>
			<TableForm onSubmit={handleCreate} />
			<table>
				<thead>
					<tr>
						<th>Số bàn</th>
						<th>Sức chứa</th>
						<th>Trạng thái</th>
						<th>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{tables.map((table) => (
						<tr key={table._id}>
							<td>{table.tableNumber}</td>
							<td>{table.capacity}</td>
							<td>{table.status}</td>
							<td>
								<button onClick={() => setEditingTable(table)}>Sửa</button>
								<button onClick={() => handleDelete(table._id)}>Xoá</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{editingTable && (
				<div>
					<h3>Chỉnh sửa bàn</h3>
					<TableForm
						initialData={editingTable}
						onSubmit={(data) => handleUpdate(editingTable._id, data)}
					/>
				</div>
			)}
		</div>
	);
};

export default TableListPage;
