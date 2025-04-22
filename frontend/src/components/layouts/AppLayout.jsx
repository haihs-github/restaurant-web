import { Outlet, NavLink } from 'react-router-dom';

function AppLayout() {
	return (
		<div>
			<hr />
			<Outlet />
		</div>
	);
}

export default AppLayout;
