import { useEffect, useState } from 'react';
import styles from './updateDishForm.module.scss';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';


const UpdateDishForm = ({ onClose, categories, fetchDishes, dish }) => {
	const [activeTab, setActiveTab] = useState('options');

	/* --- state khởi tạo từ dữ liệu món ăn --- */
	const [dishName, setDishName] = useState('');
	const [dishPrice, setDishPrice] = useState('');
	const [dishDescription, setDishDescription] = useState('');
	const [category, setCategory] = useState('');
	const [previewImage, setPreviewImage] = useState(null);  // base64 cho xem trước
	const [selectedFile, setSelectedFile] = useState(null);  // file mới nếu user chọn

	/* điền dữ liệu khi component mount */
	useEffect(() => {
		if (dish) {
			setDishName(dish.name || '');
			setDishPrice(dish.price || '');
			setDishDescription(dish.description || '');
			/* tìm tên category từ danh sách truyền vào */
			const foundCat = categories.find(c => c._id === dish.category_id);
			setCategory(foundCat ? foundCat.name : dish.category_id || '');

			setPreviewImage(dish.thumbnail || null); // hiển thị ảnh cũ
		}
	}, [dish, categories]);

	/* ---------- Xử lý submit ---------- */
	const handleUpdateDish = async () => {
		try {
			if (!dishName || !dishPrice || !dishDescription || !category) {
				alert('Vui lòng nhập đầy đủ thông tin.');
				return;
			}

			const formData = new FormData();
			formData.append('name', dishName);
			formData.append('price', dishPrice);
			formData.append('description', dishDescription);
			formData.append('category', category);

			// chỉ append thumbnail khi người dùng CHỌN file mới
			if (selectedFile) {
				formData.append('thumbnail', selectedFile);
			} else {
				// nếu không đổi ảnh, gửi path cũ để backend giữ lại
				formData.append('thumbnail', dish.thumbnail);
			}
			alert('Đang xử lý!');
			onClose();
			await axios.put(`http://localhost:5000/api/dishes/${dish._id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			alert('Cập nhật thành công!');
			await fetchDishes();

		} catch (err) {
			console.error('Lỗi khi cập nhật:', err.response?.data || err.message);
			alert('Cập nhật thất bại!');
		}
	};

	/* ---------- các handler phụ ---------- */
	const handleBrowseClick = () => document.getElementById('fileInput').click();

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setSelectedFile(file);

		if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onloadend = () => setPreviewImage(reader.result);
			reader.readAsDataURL(file);
		} else {
			setPreviewImage(null);
		}
	};

	const handleRemoveImage = () => {
		setSelectedFile(null);
		setPreviewImage(null);
		document.getElementById('fileInput').value = '';
	};

	/* ---------- giao diện ---------- */
	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				{/* HEADER */}
				<div className={styles.modalHeader}>
					<h2 className={styles.modalTitle}>Cập nhật món ăn</h2>
					<button className={styles.closeButton} onClick={onClose}><FaTimes /></button>
				</div>

				<div className={styles.modalBody}>
					{/* KHUNG ẢNH */}
					<div className={styles.leftPanel}>
						<div className={styles.dropZone}>
							{previewImage ? (
								<div className={styles.imagePreviewContainer}>
									<img src={previewImage} alt="thumbnail" className={styles.imagePreview} />
									<button className={styles.removeImageButton} onClick={handleRemoveImage}><FaTimes /></button>
								</div>
							) : (
								<>
									<FaCloudUploadAlt className={styles.uploadIcon} />
									<p className={styles.dropText}>Thêm / đổi ảnh món ăn</p>
									<p className={styles.browseText}>
										hoặc <span className={styles.browseLink} onClick={handleBrowseClick}>chọn từ máy</span>
									</p>
								</>
							)}
							<input
								type="file"
								id="fileInput"
								style={{ display: 'none' }}
								onChange={handleFileChange}
								accept="image/*"
							/>
						</div>
					</div>

					{/* FORM THÔNG TIN */}
					<div className={styles.rightPanel}>
						<div className={styles.tabs}>
							<button
								className={`${styles.tabButton} ${activeTab === 'options' ? styles.active : ''}`}
								onClick={() => setActiveTab('options')}
							>
								Thông tin món ăn
							</button>
						</div>

						{activeTab === 'options' && (
							<div className={styles.tabContent}>
								{/* tên */}
								<div className={styles.formGroup}>
									<label htmlFor="dishName" className={styles.formLabel}>Tên món ăn</label>
									<input
										type="text"
										id="dishName"
										className={styles.formInput}
										value={dishName}
										onChange={e => setDishName(e.target.value)}
										required
									/>
								</div>

								{/* giá */}
								<div className={styles.formGroup}>
									<label htmlFor="dishPrice" className={styles.formLabel}>Giá</label>
									<input
										type="number"
										id="dishPrice"
										className={styles.formInput}
										value={dishPrice}
										onChange={e => setDishPrice(e.target.value)}
										required
									/>
								</div>

								{/* mô tả */}
								<div className={styles.formGroup}>
									<label htmlFor="dishDescription" className={styles.formLabel}>Mô tả</label>
									<textarea
										id="dishDescription"
										className={styles.formTextarea}
										value={dishDescription}
										onChange={e => setDishDescription(e.target.value)}
										rows="4"
										required
									/>
								</div>

								{/* danh mục */}
								<div className={styles.formRow}>
									<div className={`${styles.formGroup} ${styles.fullWidth}`}>
										<label htmlFor="category" className={styles.formLabel}>Danh mục</label>
										<input
											list="categoryOptions"
											id="category"
											className={styles.formSelect}
											value={category}
											onChange={e => setCategory(e.target.value)}
											placeholder="Chọn hoặc nhập danh mục"
											required
										/>
										<datalist id="categoryOptions">
											{categories.map(cat => (
												<option key={cat._id} value={cat.name} />
											))}
										</datalist>
									</div>
								</div>
							</div>
						)}

						{/* BUTTONS */}
						<div className={styles.formActions}>
							<button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleUpdateDish}>
								Lưu thay đổi
							</button>
							<button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>
								Hủy
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UpdateDishForm;
