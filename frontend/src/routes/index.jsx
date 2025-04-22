import { createBrowserRouter } from 'react-router-dom';
// import page
import AppLayout from '../components/layouts/AppLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import OrdersPage from '../features/orders/OrdersPage';
import InvoicesPage from '../features/invoices/InvoicesPage';
import NotFoundPage from '../pages/NotFoundPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: 'orders', element: <OrdersPage /> },
			{ path: 'invoices', element: <InvoicesPage /> }
		]
	},
	{
		path: '/login',
		element: <LoginPage />
	},
	{
		path: '*',
		element: <NotFoundPage />
	}
]);

export default router;
