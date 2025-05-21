// src/components/UserTable/UserTable.jsx
import React from 'react';
import styles from './UserTable.module.scss';
import { FaUserCircle, FaTimesCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

const UserTable = () => {
	const [users, setUsers] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await axios.get(`http://localhost:5000/api/users?page=${page}&limit=10`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});
				setUsers(res.data.users);
				setTotalPage(res.data.totalPage);
			} catch (err) {
				console.error('Lỗi khi lấy users:', err);
			}
		};
		fetchUsers();
	}, [page]);


	return (
		<div className={styles.userTableContainer}>
			<table className={styles.table}>
				<thead>
					<tr>
						<td>STT</td>
						<td>Tên đăng nhập</td>
						<td>Tên đầy đủ</td>
						<td>email</td>
						<td>SĐT</td>
						<td>Vai trò</td>
						<td>Thao tác</td>
					</tr>
				</thead>
				<tbody>
					{users.map((user, index) => (
						<tr key={user.id}>
							<td>{++index}</td>
							<td>
								{user.username}
							</td>
							<td>{user.fullname}</td>
							<td>
								{user.email}
							</td>
							<td>{user.phone}</td>
							<td>{user.role}</td>
							<td>
								<button className={styles.editButton}>Sửa</button>
								<button className={styles.deleteButton}>Xóa</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className={styles.paginationContainer}>
				<button
					onClick={() => setPage(page - 1)}
					disabled={page === 1}
					className={styles.pageButton}
				>
					&laquo;
				</button>

				{Array.from({ length: totalPage }, (_, i) => (
					<button
						key={i}
						onClick={() => setPage(i + 1)}
						className={`${styles.pageButton} ${page === i + 1 ? styles.active : ''}`}
					>
						{i + 1}
					</button>
				))}

				<button
					onClick={() => setPage(page + 1)}
					disabled={page === totalPage}
					className={styles.pageButton}
				>
					&raquo;
				</button>
			</div>
		</div>
	);
};

export default UserTable;