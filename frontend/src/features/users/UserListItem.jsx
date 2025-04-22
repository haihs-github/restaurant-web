// features/users/UserListItem.jsx
import React from 'react';

const UserListItem = ({ user, onDelete, onEdit, onView }) => {
	return (
		<tr>
			<td>{user.fullname}</td>
			<td>{user.email}</td>
			<td>{user.role}</td>
			<td>
				<button onClick={() => onView(user)}>Xem</button>
				<button onClick={() => onEdit(user)}>Sửa</button>
				{user.isAvailable
					? <button onClick={() => onDelete(user._id)}>Xóa</button>
					: <button>đã nghỉ</button>
				}
			</td>
		</tr >
	);
};

export default UserListItem;
