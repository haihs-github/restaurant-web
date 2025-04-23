import React from 'react';

const TableListItem = ({ table, onEdit, onDelete }) => {
	console.log('table.isAvailable', table.isAvailable)
	return (
		<>
			{
				table.isAvailable && (<tr>
					<td>{table.tableNumber}</td>
					<td>{table.capacity}</td>
					<td>{table.status}</td>
					<td>
						<button onClick={() => onEdit(table)}>Sửa</button>
						<button onClick={() => onDelete(table._id)}>Xoá</button>
					</td>
				</tr>)
			}
		</>
	);
};

export default TableListItem;
