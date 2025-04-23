import { createBrowserRouter } from 'react-router-dom';
// import page
import AppLayout from '../components/layouts/AppLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import OrdersPage from '../features/orders/OrdersPage';
import InvoicesPage from '../features/invoices/InvoicesPage';
import NotFoundPage from '../pages/NotFoundPage';
import RegisterPage from '../pages/RegisterPage'
import ProtectedRoute from './ProtectedRoute'
// import UserListPage from '../features/users';
import TableListPage from '../features/tables/TableListPage';
import DishListPage from '../features/dishes/DishListPage'

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
		path: '/dishes',
		element: (
			<DishListPage />
		)
	}, {
		path: '/tables',
		element: (
			<ProtectedRoute requiredRole="admin">
				<TableListPage />
			</ProtectedRoute>
		)
	},
	{
		path: '*',
		element: <NotFoundPage />
	}
]);

export default router;
