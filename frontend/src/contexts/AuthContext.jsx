import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const stored = localStorage.getItem("user");
		return stored ? JSON.parse(stored) : null;
	});

	const login = (userData, token) => {
		console.log('userData', userData)
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(userData));
		setUser(userData);
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
