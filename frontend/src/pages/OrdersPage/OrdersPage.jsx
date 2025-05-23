// src/components/OrdersPage/OrdersPage.jsx
import styles from './OrdersPage.module.scss';
import Sidebar from '../../components/SideBar';
import Header from '../../components/Header';
import { FaPlus } from 'react-icons/fa';
import CreateOrderForm from '../../components/CreateOrderForm';
import { useEffect, useState, useCallback } from 'react'; // Import useCallback
import axios from 'axios';
import UpdateOrderForm from '../../components/UpdateOrderForm';
import InvoiceOverlay from '../../components/InvoiceOverlay'


const OrdersPage = () => {
	const [showForm, setShowForm] = useState(false)
	const [showUpdateForm, setShowUpdateForm] = useState(false)
	const [allOrders, setAllOrders] = useState([]); // Giữ tất cả các đơn hàng gốc
	const [displayedOrders, setDisplayedOrders] = useState([]); // Các đơn hàng hiển thị sau khi lọc/tìm kiếm
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [userCreated, setUserCreated] = useState(false)
	const [orderUpdate, setOrderUpdate] = useState(false)
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [showItems, setShowItems] = useState(false)
	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState('');

	// Sử dụng useCallback để hàm fetchOrders không bị tạo lại không cần thiết
	const fetchOrders = useCallback(async () => {
		try {
			const res = await axios.get(`http://localhost:5000/api/orders?page=${page}&limit=10`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			setAllOrders(res.data.orders); // Cập nhật tất cả đơn hàng
			setDisplayedOrders(res.data.orders); // Ban đầu hiển thị tất cả
			setTotalPage(res.data.totalPage);
		} catch (err) {
			console.error('Lỗi khi lấy users:', err);
		}
	}, [page]); // Chỉ phụ thuộc vào page

	useEffect(() => {
		fetchOrders();
	}, [page, userCreated, orderUpdate, fetchOrders]); // Thêm fetchOrders vào dependency array

	// Effect để xử lý tìm kiếm và lọc khi searchTerm hoặc filterStatus thay đổi
	useEffect(() => {
		let filteredAndSearchedOrders = allOrders;

		// Lọc theo trạng thái
		if (filterStatus !== '') {
			filteredAndSearchedOrders = filteredAndSearchedOrders.filter(order => order.status === filterStatus);
		}

		// Tìm kiếm theo tên khách hàng
		if (searchTerm) {
			filteredAndSearchedOrders = filteredAndSearchedOrders.filter(order =>
				order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		setDisplayedOrders(filteredAndSearchedOrders);
	}, [searchTerm, filterStatus, allOrders]); // Phụ thuộc vào searchTerm, filterStatus và allOrders

	const handleAddOrder = () => {
		setShowForm(true)
	};

	const handleHideRegister = () => {
		setShowForm(false);
	};

	const onUserCreated = () => {
		setUserCreated(prev => !prev); // toggle để kích hoạt useEffect
		setShowForm(false);     // ẩn form sau khi thêm
	}

	const handleShowUpdate = (id) => {
		setShowUpdateForm(true)
		setSelectedOrder(id)
	};

	const handleHideUpdate = () => {
		setShowUpdateForm(false);
	};

	const onOrderUpdate = () => {
		setOrderUpdate(prev => !prev); // toggle để kích hoạt useEffect
		setShowUpdateForm(false);     // ẩn form sau khi cập nhật
	}

	const handleDeleteBtn = async (id) => {
		if (!window.confirm("Bạn có chắc chắn muốn xóa Đơn hàng này?")) return;
		alert("Dữ liệu đang được xử lý");
		try {
			const res = await axios.delete(`http://localhost:5000/api/orders/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			alert("Xóa thành công");
			console.log(res.data);
			fetchOrders(); // Tải lại danh sách
		} catch (err) {
			console.error("Lỗi khi xóa:", err.response?.data || err.message);
			alert("Xóa thất bại");
		}
	}

	const handleShowItems = (id) => {
		setShowItems(true)
		setSelectedOrder(id)
	}

	const handleHideItems = () => {
		setShowItems(false);
	};

	return (
		<div className={styles.dashboardLayout}>
			<Header />

			<div className={styles.mainContentArea}>
				<Sidebar />
				<div className={styles.contentPanel}>
					<div className={styles.searchContainer}>
						<input
							type="text"
							placeholder="Tìm theo tên khách hàng..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={styles.searchInput}
						/>
						Trạng thái
						<select
							value={filterStatus}
							onChange={(e) => {
								setFilterStatus(e.target.value); // Chỉ cập nhật filterStatus
							}}
							className={styles.selectFilter}
						>
							<option value="">Tất cả trạng thái</option>
							<option value="pending">Chờ xử lý</option>
							<option value="confirmed">Đã xác nhận</option>
							<option value="completed">Hoàn thành</option>
							<option value="cancelled">Đã hủy</option>
						</select>

					</div>


					<div className={styles.addUserSection}>
						<button className={styles.addUserButton} onClick={handleAddOrder}>
							<FaPlus className={styles.addUserIcon} />
							Tạo đơn hàng
						</button>
					</div>

					<div className={styles.userTableContainer}>
						<table className={styles.table}>
							<thead>
								<tr>
									<td>STT</td>
									<td>Họ tên</td>
									<td>SĐT</td>
									<td>email</td>
									<td>bàn đặt</td>
									<td>ngày đặt</td>
									<td>trạng thái</td>
									<td>Thao tác</td>
								</tr>
							</thead>
							<tbody>
								{displayedOrders
									.map((order, index) => (
										<tr key={order._id}>
											<td>{++index}</td>
											<td>{order.customerName}</td>
											<td>{order.customerPhone}</td>
											<td>{order.emailCustomer}</td>
											<td>#{order.table_id.tableNumber}</td>
											<td>{new Date(order.orderTime).toLocaleDateString()}</td>
											<td>{order.status}</td>
											<td>
												<button className={styles.viewButton} onClick={() => handleShowItems(order._id)}>Xem</button>
												<button className={styles.editButton} onClick={() => handleShowUpdate(order._id)}>Sửa</button>
												<button className={styles.deleteButton} onClick={() => handleDeleteBtn(order._id)}>Xóa</button>
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
			{showForm && <CreateOrderForm handleHideRegister={handleHideRegister}
				onOrderCreated={onUserCreated}
			/>}
			{showUpdateForm && <UpdateOrderForm id={selectedOrder} handleHideUpdate={handleHideUpdate}
				onOrderUpdate={onOrderUpdate} fetchOrders={fetchOrders}
			/>}
			{showItems && <InvoiceOverlay id={selectedOrder} handleHideUpdate={handleHideItems}
			/>}

		</div >
	);
};

export default OrdersPage;