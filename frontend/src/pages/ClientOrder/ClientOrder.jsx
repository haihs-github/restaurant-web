import React, { useState, useEffect } from 'react';
import styles from './ClientOrder.module.scss';
import Sidebar from './Sidebar';
import ProductGrid from './ProductGrid';
import OrderSummary from './OrderSummary';
import Header from '../../components/Header';
import axios from 'axios';

const ClientOrder = () => {
	const [activeTab, setActiveTab] = useState('menu'); // 'tables' or 'menu'
	const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'food', 'drinks'
	const [orders, setOrders] = useState([]);
	const [orderItems, setOrderItems] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState(null); // Placeholder for table selection

	const [dishes, setDishes] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [userCreated, setUserCreated] = useState(false)
	const [categories, setCategories] = useState([]);
	// fetch mon an 
	useEffect(() => {
		const fetchDishes = async () => {
			try {
				const res = await axios.get(`http://localhost:5000/api/dishes`);
				setDishes(res.data.dishes);
				setTotalPage(res.data.totalPage);
			} catch (err) {
				console.error('Lỗi khi lấy users:', err);
			}
		};
		fetchDishes();
	}, []);

	// fetch order 
	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await axios.get(`http://localhost:5000/api/orders?page=1&limit=10?`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});
				console.log('res.data.orders', res.data)
				setOrders(res.data.orders);
				setSelectedOrder(res.data.orders[0]);
			} catch (err) {
				console.error('Lỗi khi lấy order:', err);
			}
		};
		fetchOrders();
	}, []);

	// fetch the loai 

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await axios.get('http://localhost:5000/api/categories');
				setCategories(res.data.categories); // giả sử response là { categories: [...] }
			} catch (err) {
				console.error('Lỗi khi lấy danh sách danh mục:', err);
			}
		};

		fetchCategories(); // gọi thêm để lấy tên danh mục
	}, []);

	const handleCategoryChange = (category) => {
		setSelectedCategory(category);
	};


	const handleAddOrderItem = (dish) => {
		setOrderItems((prevItems) => {
			const existingItem = prevItems.find((item) => item._id === dish._id);
			if (existingItem) {
				return prevItems.map((item) =>
					item._id === dish._id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			} else {
				return [
					...prevItems,
					{
						...dish,
						quantity: 1,
						dish_id: dish._id, // 👈 Thêm dòng này
					},
				];
			}
		});
	};


	const handleRemoveOrderItem = (dishId) => {
		setOrderItems((prevItems) =>
			prevItems.filter((item) => item._id !== dishId)
		);
	};

	const handleQuantityChange = (dishId, newQuantity) => {
		setOrderItems((prevItems) =>
			prevItems
				.map((item) =>
					item._id === dishId ? { ...item, quantity: newQuantity } : item
				)
				.filter((item) => item.quantity > 0) // Loại bỏ nếu số lượng về 0
		);
	};

	const calculateTotal = () => {
		return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
	};

	return (
		<div className={styles.clientOrderContainer}>
			<Header />
			<div className={styles.mainContentArea}>
				<Sidebar
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					selectedCategory={selectedCategory}
					onCategoryChange={handleCategoryChange}
					categories={categories}
				/>
				<ProductGrid
					dishes={dishes}
					selectedCategory={selectedCategory}
					onAddOrderItem={handleAddOrderItem}
				/>
				<OrderSummary
					orders={orders}
					orderItems={orderItems}
					onRemoveOrderItem={handleRemoveOrderItem}
					handleQuantityChange={handleQuantityChange}
					total={calculateTotal()}
					selectedOrder={selectedOrder}
					setSelectedOrder={setSelectedOrder}
				/>
			</div>
		</div>
	);
};

export default ClientOrder;