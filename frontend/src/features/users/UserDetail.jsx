// features/users/UserDetail.jsx
import React from "react";

const UserDetail = ({ user, onClose }) => {
	if (!user) return null;

	return (
		<div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
			<h3>Chi tiết người dùng</h3>
			<p><strong>Họ tên:</strong> {user.username}</p>
			<p><strong>Email:</strong> {user.email}</p>
			<p><strong>Vai trò:</strong> {user.role}</p>
			<button onClick={onClose}>Đóng</button>
		</div>
	);
};

export default UserDetail;
