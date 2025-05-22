// src/components/TablesPage/TablesPage.jsx
import styles from './TablesPage.module.scss';
import Sidebar from '../../components/SideBar';
import Header from '../../components/Header';
import { FaPlus } from 'react-icons/fa';
import RegisterPage from '../../components/RegisterPage';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateTableForm from '../../components/CreateTableForm';
import UpdateTableForm from '../../components/UpdateTableForm';


const TablesPage = () => {
	// const [currentPage, setCurrentPage] = useState(1);
	const [showForm, setShowForm] = useState(false)
	const [showUpdateForm, setShowUpdateForm] = useState(false)
	const [tables, setTables] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [userCreated, setUserCreated] = useState(false)
	const [userUpdate, setUserUpdate] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null);

	const fetchTables = async () => {
		try {
			const res = await axios.get(`http://localhost:5000/api/tables?page=${page}&limit=10`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			setTables(res.data.tables);
			setTotalPage(res.data.totalPage);
		} catch (err) {
			console.error('Lỗi khi lấy users:', err);
		}
	};
	useEffect(() => {
		fetchTables();
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
			const res = await axios.delete(`http://localhost:5000/api/tables/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			alert("Xóa thành công");
			console.log(res.data);
			// Sau khi xóa, gọi lại hàm load danh sách
			fetchTables(); // ví dụ hàm để load lại danh sách
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
							Thêm bàn
						</button>
					</div>

					<div className={styles.userTableContainer}>
						<table className={styles.table}>
							<thead>
								<tr>
									<td>Bàn số</td>
									<td>Sức chứa</td>
									<td>trạng thái</td>
									<td>Thao tác</td>
								</tr>
							</thead>
							<tbody>
								{tables.map((table, index) => (
									<tr key={table._id}>
										<td>
											#{table.tableNumber}
										</td>
										<td>{table.capacity}</td>
										<td>{table.status}</td>
										<td>
											<button className={styles.editButton} onClick={() => { handleShowUpdate(table._id) }}>Sửa</button>
											<button className={styles.deleteButton} onClick={() => handleDeleteBtn(table._id)}>Xóa</button>
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
			{showForm && <CreateTableForm handleHideRegister={handleHideRegister}
				onUserCreated={onUserCreated}
			/>}
			{showUpdateForm && <UpdateTableForm id={selectedUser} handleHideUpdate={handleHideUpdate}
				onUserUpdate={onUserUpdate} fetchTables={fetchTables}
			/>}

		</div >
	);
};

export default TablesPage;