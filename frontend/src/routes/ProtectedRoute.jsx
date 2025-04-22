import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Sử dụng hook

const ProtectedRoute = ({ children, requiredRole }) => {
	const { user } = useAuth(); // dùng useAuth thay vì useContext

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (requiredRole && user.role !== requiredRole) {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default ProtectedRoute;
