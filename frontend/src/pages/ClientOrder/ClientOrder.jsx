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
	const [selectedTable, setSelectedTable] = useState('Bàn 1'); // Placeholder for table selection

	const [dishes, setDishes] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [userCreated, setUserCreated] = useState(false)
	const [categories, setCategories] = useState([]);
	// fetch mon an 
	useEffect(() => {
		const fetchDishes = async () => {
			try {
				const res = await axios.get(`http://localhost:5000/api/dishes?page=${page}&limit=10`);
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
				const res = await axios.get(`http://localhost:5000/api/orders`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});
				setOrders(res.data.orders);
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
			const existingItem = prevItems.find((item) => item.id === dish.id);
			if (existingItem) {
				return prevItems.map((item) =>
					item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
				);
			} else {
				return [...prevItems, { ...dish, quantity: 1 }];
			}
		});
	};

	const handleRemoveOrderItem = (dishId) => {
		setOrderItems((prevItems) =>
			prevItems.filter((item) => item.id !== dishId)
		);
	};

	const handleQuantityChange = (dishId, newQuantity) => {
		setOrderItems((prevItems) =>
			prevItems
				.map((item) =>
					item.id === dishId ? { ...item, quantity: newQuantity } : item
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
					onQuantityChange={handleQuantityChange}
					total={calculateTotal()}
					selectedTable={selectedTable}
					setSelectedTable={setSelectedTable}
				/>
			</div>
		</div>
	);
};

export default ClientOrder;