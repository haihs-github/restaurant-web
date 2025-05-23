import Header from '../../components/Header';
import styles from './HomePage.module.scss';
import { useState } from 'react';
import CreateOrderForm from '../../components/CreateOrderForm';

const HomePage = () => {
	const [showForm, setShowForm] = useState(false)

	const handleShowForm = () => {
		setShowForm(true)
	}

	const handleHideRegister = () => {
		setShowForm(false)
	}

	return (
		<div className={styles.homePageContainer}>
			<Header />

			<main className={styles.mainContent}>
				<section className={styles.heroSection}>
					<img
						src="https://brand-pcms.ggg.systems/media/so/homecmsdata/banners/1500x700-01_1_1.png" // Ảnh banner chính
						alt="Ưu đãi My Restaurant"
						className={styles.heroBanner}
					/>
				</section>
				{/* --- PHẦN THÊM MỚI --- */}

				<section className={styles.aboutSection}>
					<div className={styles.sectionWrapper}>
						<h2 className={styles.sectionTitle}>Giới thiệu về chúng tôi</h2>
						<p className={styles.sectionDescription}>
							Chào mừng quý khách đến với My Restaurant - nơi hương vị Hàn Quốc đích thực hội tụ!
							Chúng tôi tự hào mang đến những món nướng BBQ chuẩn vị, các món ăn truyền thống
							đậm đà cùng không gian ẩm thực ấm cúng và hiện đại. Với nguyên liệu tươi ngon
							được chọn lọc kỹ càng và đội ngũ đầu bếp tài năng, My Restaurant cam kết đem lại
							trải nghiệm ẩm thực khó quên cho mọi thực khách. Hãy đến và khám phá thế giới
							ẩm thực Hàn Quốc đầy màu sắc cùng chúng tôi!
						</p>
						<p className={styles.sectionDescription}>
							Ngoài ra, chúng tôi còn có nhiều ưu đãi hấp dẫn hàng tháng và thực đơn đa dạng từ gỏi món đến combo, phù hợp với mọi sở thích.
						</p>
					</div>
				</section>
				<section className={styles.contactSection}>
					<div className={styles.sectionWrapper}>
						<h2 className={styles.sectionTitle}>Liên hệ với chúng tôi</h2>
						<div className={styles.callToAction}>
							<p className={styles.callToActionText}>Sẵn sàng thưởng thức hương vị Hàn Quốc?</p>
							<a onClick={handleShowForm} className={`${styles.btn} ${styles.btnBooking}`}>
								Đặt bàn ngay!
							</a>
						</div>
						<p className={styles.contactText}>
							Quý khách có bất kỳ thắc mắc hay yêu cầu nào, đừng ngần ngại liên hệ với chúng tôi:
						</p>
						<ul className={styles.contactList}>
							<li className={styles.contactItem}>
								<strong>Điện thoại:</strong> <a href="tel:+84123456789">+84 123 456 789</a>
							</li>
							<li className={styles.contactItem}>
								<strong>Email:</strong> <a href="mailto:info@myreustrant.vn">info@myreustrant.vn</a>
							</li>
							<li className={styles.contactItem}>
								<strong>Fanpage:</strong> <a href="https://facebook.com/myreustrant" target="_blank" rel="noopener noreferrer">facebook.com/myreustrant</a>
							</li>
						</ul>
					</div>
				</section>
			</main>

			<footer className={styles.mainFooter}>
				<p>&copy; 2025 My Restaurant. All rights reserved.</p>
			</footer>
			{showForm && <CreateOrderForm handleHideRegister={handleHideRegister}
			/>}
		</div>
	);
};

export default HomePage;