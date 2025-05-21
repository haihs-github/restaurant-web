// src/components/UserPage/UserPage.jsx
import styles from './UserPage.module.scss';
import Sidebar from '../../components/SideBar';
import Header from '../../components/Header';
import { FaPlus } from 'react-icons/fa';
import RegisterPage from '../../components/RegisterPage';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateUserForm from '../../components/UpdateUserForm';


const UserPage = () => {
	// const [currentPage, setCurrentPage] = useState(1);
	const [showForm, setShowForm] = useState(false)
	const [showUpdateForm, setShowUpdateForm] = useState(false)
	const [users, setUsers] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [userCreated, setUserCreated] = useState(false)
	const [userUpdate, setUserUpdate] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null);

	const fetchUsers = async () => {
		try {
			const res = await axios.get(`http://localhost:5000/api/users?page=${page}&limit=5`, {
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
	useEffect(() => {

		fetchUsers();
	}, [page, userCreated]);

	const handleAddUser = () => {
		setShowForm(true)
	};

	const handleHideRegister = () => {
		setShowForm(false);
	};

	const onUserCreated = () => {
		setUserCreated(prev => !prev); // toggle để kích hoạt useEffect
		setShowForm(false);    // ẩn form sau khi thêm
	}

	const handleShowUpdate = (id) => {
		setShowUpdateForm(true)
		setSelectedUser(id)
	};

	const handleHideUpdate = () => {
		setShowUpdateForm(false);
	};

	const onUserUpdate = () => {
		setUserUpdate(prev => !prev); // toggle để kích hoạt useEffect
		setShowForm(false);    // ẩn form sau khi thêm
	}

	const handleDeleteBtn = async (id) => {
		console.log(id)
		if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

		try {
			const token = localStorage.getItem("token"); // hoặc lấy từ context nếu bạn dùng AuthContext
			const res = await axios.delete(`http://localhost:5000/api/users/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			alert("Xóa thành công");
			console.log(res.data);
			// Sau khi xóa, gọi lại hàm load danh sách
			fetchUsers(); // ví dụ hàm để load lại danh sách
		} catch (err) {
			console.error("Lỗi khi xóa:", err.response?.data || err.message);
			alert("Xóa thất bại");
		}
	}

	return (
		<div className={styles.dashboardLayout}>
			{/* Nếu muốn header nằm ngoài layout chính thì đặt ở đây */}
			<Header />

			<div className={styles.mainContentArea}>
				<Sidebar />
				<div className={styles.contentPanel}>
					<div className={styles.addUserSection}>
						<button className={styles.addUserButton} onClick={handleAddUser}>
							<FaPlus className={styles.addUserIcon} />
							Add User
						</button>
					</div>

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
									<tr key={user._id}>
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
											<button className={styles.editButton} onClick={() => { handleShowUpdate(user._id) }}>Sửa</button>
											<button className={styles.deleteButton} onClick={() => handleDeleteBtn(user._id)}>Xóa</button>
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
				</div>
			</div>
			{showForm && <RegisterPage handleHideRegister={handleHideRegister}
				onUserCreated={onUserCreated}
			/>}
			{showUpdateForm && <UpdateUserForm id={selectedUser} handleHideUpdate={handleHideUpdate}
				onUserUpdate={onUserUpdate} fetchUsers={fetchUsers}
			/>}

		</div >
	);
};

export default UserPage;