import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(() => localStorage.getItem("token"));

	function decodeJWT(token) {
		if (!token) return null;
		try {
			const payloadBase64 = token.split('.')[1];
			const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split('')
					.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
					.join('')
			);
			return JSON.parse(jsonPayload);
		} catch (error) {
			console.error("Lỗi decode JWT:", error);
			return null;
		}
	}

	// CHỈ chạy 1 lần khi load trang (nếu muốn giữ đăng nhập trước đó)
	useEffect(() => {
		const savedToken = localStorage.getItem("token");
		if (savedToken) {
			setToken(savedToken);
			const decoded = decodeJWT(savedToken);
			if (decoded) {
				setUser(decoded);
			}
		}
	}, []); // chạy 1 lần duy nhất khi load

	const login = (newToken) => {
		localStorage.setItem("token", newToken);
		setToken(newToken);
		const decoded = decodeJWT(newToken);
		if (decoded) {
			setUser(decoded);
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
