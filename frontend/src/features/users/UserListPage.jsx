// features/users/UserListPage.jsx
import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser, updateUser } from './userApi';
import UserListItem from './UserListItem';
import Header from '../../components/Header';
import UpdateUserForm from './UpdateUserForm'; // Import component form sửa
import UserDetail from './UserDetail';

const UserListPage = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false); // State điều khiển form sửa
	const [currentUser, setCurrentUser] = useState(null); // Lưu thông tin user đang sửa
	const [viewingUser, setViewingUser] = useState(null); // User đang được xem chi tiết


	// Lấy danh sách user khi load trang
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data = await getAllUsers();
				setUsers(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, []);

	// Xoá user
	const handleDelete = async (userId) => {
		if (!window.confirm('Bạn có chắc muốn xoá tài khoản này không?')) return;

		try {
			await deleteUser(userId);
			setUsers(users.filter((u) => u._id !== userId));
		} catch (err) {
			console.error('Lỗi khi xoá user:', err);
		}
	};

	// Hàm sửa thông tin user
	const handleEdit = (user) => {
		setIsEditing(true);
		setCurrentUser(user);
	};

	// Hàm xử lý submit form sửa
	const handleUpdateSubmit = async (updatedUser) => {
		try {
			await updateUser(currentUser._id, updatedUser);
			setUsers(users.map(user => (user._id === currentUser._id ? updatedUser : user)));
			setIsEditing(false);
			setCurrentUser(null);
		} catch (err) {
			console.error('Lỗi khi sửa user:', err);
		}
	};

	// Hàm hủy form sửa
	const handleCancelEdit = () => {
		setIsEditing(false);
		setCurrentUser(null);
	};

	const handleView = (user) => {
		setViewingUser(user);
	};

	const handleCloseDetail = () => {
		setViewingUser(null);
	};


	if (loading) return <p>Đang tải...</p>;

	return (
		<div>
			<Header />
			<h2>Danh sách người dùng</h2>

			{/* Hiển thị form sửa nếu đang sửa */}
			{isEditing && currentUser && (
				<UpdateUserForm
					user={currentUser}
					onSubmit={handleUpdateSubmit}
					onCancel={handleCancelEdit}
				/>
			)}

			{/* Hiển thị danh sách người dùng */}
			<table>
				<thead>
					<tr>
						<th>Họ tên</th>
						<th>Email</th>
						<th>Vai trò</th>
						<th>Hành động</th>
					</tr>
				</thead>
				{viewingUser && (
					<UserDetail user={viewingUser} onClose={handleCloseDetail} />
				)}
				<tbody>
					{users.map((user) => (
						<UserListItem
							key={user._id}
							user={user}
							onDelete={handleDelete}
							onEdit={handleEdit}
							onView={handleView}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UserListPage;
