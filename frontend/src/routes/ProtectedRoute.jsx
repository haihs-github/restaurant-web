// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, requiredRole }) => {
	const { user } = useAuth();
	const [checkingAuth, setCheckingAuth] = useState(true);

	useEffect(() => {
		// Giả lập delay để đảm bảo user được set từ AuthContext useEffect (nếu có)
		const timeout = setTimeout(() => setCheckingAuth(false), 100);
		return () => clearTimeout(timeout);
	}, []);

	// Loading giai đoạn đầu (tránh redirect quá sớm khi AuthContext đang xử lý user)
	if (checkingAuth) {
		return <div>Đang kiểm tra quyền truy cập...</div>; // hoặc spinner tùy bạn
	}

	// Nếu chưa đăng nhập
	if (!user) {
		console.warn("Chặn truy cập: chưa đăng nhập.");
		return <Navigate to="/login" replace />;
	}

	// Nếu có yêu cầu role mà user không đủ quyền
	if (requiredRole && user.role !== requiredRole) {
		console.warn("Chặn truy cập: sai quyền hạn.");
		return <Navigate to="/" replace />;
	}

	// Truy cập được cho phép
	return children;
};

export default ProtectedRoute;
