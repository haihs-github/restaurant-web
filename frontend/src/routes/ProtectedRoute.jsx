// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
	const { user } = useAuth();

	// Nếu chưa đăng nhập
	if (!user) {
		console.log('user', user)
		alert("bạn cần đăng nhập để vào trang này")
		return <Navigate to="/login" replace />;
	}

	// Nếu có yêu cầu role cụ thể (ví dụ: admin), mà không đúng role
	if (requiredRole && user.role !== requiredRole) {
		return <Navigate to="/" replace />;
	}

	return children; // Cho phép truy cập
};

export default ProtectedRoute;
