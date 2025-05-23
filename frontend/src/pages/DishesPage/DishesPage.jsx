// src/components/DishesPage/DishesPage.jsx
import styles from './DishesPage.module.scss';
import Sidebar from '../../components/SideBar';
import Header from '../../components/Header';
import { FaPlus } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddDishForm from '../../components/AddDishForm';
import UpdateDishForm from '../../components/UpdateDishForm';


const DishesPage = () => {
	// const [currentPage, setCurrentPage] = useState(1);
	const [dishes, setDishes] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [userCreated, setUserCreated] = useState(false)

	const [categories, setCategories] = useState([]);

	const fetchCategories = async () => {
		try {
			const res = await axios.get('http://localhost:5000/api/categories');
			setCategories(res.data.categories); // giả sử response là { categories: [...] }
		} catch (err) {
			console.error('Lỗi khi lấy danh sách danh mục:', err);
		}
	};

	const fetchDishes = async () => {
		try {
			const res = await axios.get(`http://localhost:5000/api/dishes?page=${page}&limit=5`);
			setDishes(res.data.dishes);
			setTotalPage(res.data.totalPage);
		} catch (err) {
			console.error('Lỗi khi lấy users:', err);
		}
	};

	const handleDeleteBtn = async (id) => {
		console.log(id)
		if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

		try {
			const token = localStorage.getItem("token"); // hoặc lấy từ context nếu bạn dùng AuthContext
			const res = await axios.delete(`http://localhost:5000/api/dishes/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			alert("Xóa thành công");
			console.log(res.data);
			// Sau khi xóa, gọi lại hàm load danh sách
			fetchDishes(); // ví dụ hàm để load lại danh sách
		} catch (err) {
			console.error("Lỗi khi xóa:", err.response?.data || err.message);
			alert("Xóa thất bại");
		}
	}

	const [showAddDishForm, setShowAddDishForm] = useState(false);

	const handleOpenForm = () => {
		setShowAddDishForm(true);
	};

	const handleCloseForm = () => {
		setShowAddDishForm(false);
	};

	useEffect(() => {
		fetchDishes();
		fetchCategories(); // gọi thêm để lấy tên danh mục
	}, [page, userCreated]);

	const getCategoryName = (id) => {
		const category = categories.find((c) => c._id === id);
		return category ? category.name : 'Không rõ';
	};

	const [editingDish, setEditingDish] = useState(null);

	const handleShowUpdate = (dishId) => {
		const dish = dishes.find(d => d._id === dishId);
		setEditingDish(dish);
	};

	return (
		<div className={styles.dashboardLayout}>
			{/* Nếu muốn header nằm ngoài layout chính thì đặt ở đây */}
			<Header />
			<div className={styles.mainContentArea}>
				<Sidebar />
				<div className={styles.contentPanel}>
					<div className={styles.addUserSection}>
						<button className={styles.addUserButton} onClick={handleOpenForm} >
							<FaPlus className={styles.addUserIcon} />
							Thêm món
						</button>
					</div>

					<div className={styles.userTableContainer}>
						<table className={styles.table}>
							<thead>
								<tr>
									<td>STT</td>
									<td>Tên</td>
									<td>Danh mục</td>
									<td>Giá</td>
									<td>Mô tả</td>
									<td>Hình minh họa</td>
									<td>Thao tác</td>
								</tr>
							</thead>
							<tbody>
								{dishes.map((dish, index) => (
									<tr key={dish._id}>
										<td>{++index}</td>
										<td>
											{dish.name}
										</td>
										<td>{getCategoryName(dish.category_id)}</td>

										<td>
											{dish.price}
										</td>
										<td>{dish.description}</td>
										<td><img className={styles.dishImg} src={dish.thumbnail} alt="ảnh minh họa" /></td>
										<td>
											<button className={styles.editButton} onClick={() => { handleShowUpdate(dish._id) }}>Sửa</button>
											<button className={styles.deleteButton} onClick={() => handleDeleteBtn(dish._id)}>Xóa</button>
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
			{showAddDishForm && <AddDishForm fetchDishes={fetchDishes} categories={categories} onClose={handleCloseForm} />}
			{editingDish && (
				<UpdateDishForm
					dish={editingDish}
					categories={categories}
					fetchDishes={fetchDishes}
					onClose={() => setEditingDish(null)}
				/>
			)}
		</div >
	);
};

export default DishesPage;