import { useState } from 'react';
import styles from './AddDishForm.module.scss';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const AddDishForm = ({ onClose, categories, fetchDishes }) => {
	const [activeTab, setActiveTab] = useState('options');
	const [dishName, setDishName] = useState('');
	const [dishPrice, setDishPrice] = useState('');
	const [dishDescription, setDishDescription] = useState('');
	const [category, setCategory] = useState('');
	const [previewImage, setPreviewImage] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);

	const handleAddDish = async () => {
		try {
			// Kiểm tra dữ liệu
			if (!dishName || !dishPrice || !dishDescription || !category || !selectedFile) {
				alert('Vui lòng nhập đầy đủ thông tin và chọn ảnh món ăn.');
				return;
			}

			// Tạo formData để gửi kèm file
			const formData = new FormData();
			formData.append('name', dishName);
			formData.append('price', dishPrice);
			formData.append('description', dishDescription);
			formData.append('category', category);
			formData.append('thumbnail', selectedFile); // Key phải trùng backend

			handleCancel(); // Đóng form sau khi thêm
			alert('Đang xử lý');
			const response = await axios.post('http://localhost:5000/api/dishes/', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				},
			});

			console.log('Thêm món ăn thành công:', response.data);
			alert('Thêm món ăn thành công!');
			await fetchDishes()

		} catch (error) {
			console.error('Lỗi khi thêm món ăn:', error);
			alert('Thêm món ăn thất bại!');
		}
	};

	const handleCancel = () => {
		setDishName('');
		setDishPrice('');
		setDishDescription('');
		setCategory('');
		setPreviewImage(null);
		setSelectedFile(null);
		document.getElementById('fileInput').value = '';

		if (onClose) onClose();
	};

	const handleBrowseClick = () => {
		document.getElementById('fileInput').click();
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);

			if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onloadend = () => setPreviewImage(reader.result);
				reader.readAsDataURL(file);
			} else {
				setPreviewImage(null);
			}
		}
	};

	const handleRemoveImage = () => {
		setPreviewImage(null);
		setSelectedFile(null);
		document.getElementById('fileInput').value = '';
	};

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<div className={styles.modalHeader}>
					<h2 className={styles.modalTitle}>Thêm món ăn</h2>
					<button className={styles.closeButton} onClick={onClose}><FaTimes /></button>
				</div>

				<div className={styles.modalBody}>
					<div className={styles.leftPanel}>
						<div className={styles.dropZone}>
							{previewImage ? (
								<div className={styles.imagePreviewContainer}>
									<img src={previewImage} alt="Preview" className={styles.imagePreview} />
									<button className={styles.removeImageButton} onClick={handleRemoveImage}><FaTimes /></button>
								</div>
							) : (
								<>
									<FaCloudUploadAlt className={styles.uploadIcon} />
									<p className={styles.dropText}>Thêm ảnh món ăn</p>
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

					<div className={styles.rightPanel}>
						<div className={styles.tabs}>
							<button
								className={`${styles.tabButton} ${activeTab === 'options' ? styles.active : ''}`}
								onClick={() => setActiveTab('options')}
							>
								Mô tả món ăn
							</button>
						</div>

						{activeTab === 'options' && (
							<div className={styles.tabContent}>
								<div className={styles.formGroup}>
									<label htmlFor="dishName" className={styles.formLabel}>Tên món ăn</label>
									<div className={styles.inputWrapper}>
										<input
											type="text"
											id="dishName"
											className={styles.formInput}
											value={dishName}
											onChange={(e) => setDishName(e.target.value)}
											placeholder="Nhập tên món ăn"
											required
										/>
									</div>
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="dishPrice" className={styles.formLabel}>Giá</label>
									<div className={styles.inputWrapper}>
										<input
											type="number"
											id="dishPrice"
											className={styles.formInput}
											value={dishPrice}
											onChange={(e) => setDishPrice(e.target.value)}
											placeholder="Nhập giá"
											required
										/>
									</div>
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="dishDescription" className={styles.formLabel}>Mô tả</label>
									<div className={styles.inputWrapper}>
										<textarea
											id="dishDescription"
											className={styles.formTextarea}
											value={dishDescription}
											onChange={(e) => setDishDescription(e.target.value)}
											placeholder="Mô tả chi tiết món ăn..."
											rows="4"
											required
										></textarea>
									</div>
								</div>

								<div className={styles.formRow}>
									<div className={`${styles.formGroup} ${styles.fullWidth}`}>
										<label htmlFor="category" className={styles.formLabel}>Danh mục</label>
										<input
											list="categoryOptions"
											id="category"
											className={styles.formSelect}
											value={category}
											onChange={(e) => setCategory(e.target.value)}
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

						<div className={styles.formActions}>
							<button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAddDish}>
								Thêm món ăn
							</button>
							<button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleCancel}>
								Hủy
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddDishForm;
