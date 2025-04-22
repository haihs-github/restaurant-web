import { Outlet } from 'react-router-dom';
import UserListPage from '../../features/users';


function AppLayout() {
	return (
		<div>
			<hr />
			<Outlet />
		</div>
	);
}

export default AppLayout;
