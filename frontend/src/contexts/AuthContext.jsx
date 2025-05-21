import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

	function decodeJWT(token) {
		if (!token) return null;

		try {
			// JWT có 3 phần: header.payload.signature, ta cần phần payload (giữa)
			const payloadBase64 = token.split('.')[1];
			if (!payloadBase64) return null;

			// Thay các ký tự base64 URL safe thành chuẩn base64 thường
			const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');

			// Giải mã base64 => chuỗi JSON
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split('')
					.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
					.join('')
			);

			// Parse JSON payload ra object
			return JSON.parse(jsonPayload);
		} catch (error) {
			console.error("Lỗi decode JWT:", error);
			return null;
		}
	}

	const [user, setUser] = useState(null);
	const [token, setToken] = useState(() => localStorage.getItem("token"));

	useEffect(() => {
		if (token) {
			try {
				const decoded = decodeJWT(token);
				setUser(decoded);
				console.log("user", user)
			} catch (err) {
				console.error("Lỗi giải mã token:", err);
				logout();
			}
		}
	}, [token]);

	const login = (newToken) => {
		localStorage.setItem("token", newToken);
		setToken(newToken);
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
