import { createBrowserRouter } from 'react-router-dom';
// import page
import AppLayout from '../components/layouts/AppLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import InvoicesPage from '../features/invoices/InvoicesPage';
import NotFoundPage from '../pages/NotFoundPage';
import RegisterPage from '../pages/RegisterPage'
import ProtectedRoute from './ProtectedRoute'
// import UserListPage from '../features/users';
import TableListPage from '../features/tables/TableListPage';
import DishListPage from '../features/dishes/DishListPage'
import UserListPage from '../features/users';
import OrderListPage from '../features/orders/OrderListPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ index: true, element: <HomePage /> },

		]
	},
	{
		path: '/login',
		element: <LoginPage />
	},
	{
		path: '/register',
		element: <RegisterPage />
	},
	{
		path: '/users',
		element:
			<ProtectedRoute requiredRole="admin">
				<UserListPage />
			</ProtectedRoute>

	},
	{
		path: '/dishes',
		element: (
			<DishListPage />
		)
	}, {
		path: '/tables',
		element: (
			<TableListPage />
		)
	},
	{
		path: '/orders',
		element: (
			<ProtectedRoute>
				<OrderListPage />
			</ProtectedRoute>
		)
	},
	{
		path: '*',
		element: <NotFoundPage />
	}
]);

export default router;
