import styles from './InvoiceOverlay.module.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';

const InvoiceOverlay = ({ id, handleHideUpdate }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [order, setOrder] = useState(null);

  const fetchOrderItems = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const { orderItems } = res.data.order
      console.log('orderItems:', res.data.order)
      setOrder(res.data.order)
      setOrderItems(orderItems); // Sửa đúng key trả về từ API
    } catch (err) {
      console.error('Lỗi khi lấy orderItems:', err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderItems(id);
    }
  }, [id]);

  const fetchOrderItem = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/oderItems/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.data;
      // setOrderItems(res.data.orders); // Sửa đúng key trả về từ API
    } catch (err) {
      console.error('Lỗi khi lấy orderItems:', err);
    }
  };

  // useEffect(() => {
  //   if (id) {
  //     fetchOrder(id);
  //   }
  // }, [id]);

  const totalAmount = Array.isArray(orderItems)
    ? orderItems.reduce((sum, item) => {
      return sum + (item.dish_id?.price || 0) * item.quantity;
    }, 0)
    : 0;

  return (
    <div className={styles.invoiceOverlayBackdrop}>
      <div className={styles.invoiceOverlayContent}>
        <button className={styles.closeButton} onClick={handleHideUpdate}>
          &times;
        </button>

        <div className={styles.invoiceHeader}>
          <div className={styles.invoiceDetails}>
            <h1 className={styles.invoiceTitle}>Hóa đơn</h1>
          </div>
        </div>

        <div className={styles.billToInfo}>
          <p className={styles.billToTitle}>Khách hàng: {order?.customerName}</p>
        </div>
        <div className={styles.billToInfo}>
          <p className={styles.billToTitle}> Ngày: {new Date(order?.createdAt).toLocaleDateString()}</p>
        </div>
        <table className={styles.invoiceTable}>
          <thead>
            <tr>
              <th className={styles.tableHeaderDescription}>Món ăn</th>
              <th className={styles.tableHeaderMonths}>Số lượng</th>
              <th className={styles.tableHeaderUnitPrice}>Đơn giá</th>
              <th className={styles.tableHeaderAmount}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              < tr key={index} >
                <td className={styles.tableCellDescription}>{item.dish_id?.name || 'Không có tên'}</td>
                <td className={styles.tableCellMonths}>{item.quantity}</td>
                <td className={styles.tableCellUnitPrice}>
                  {item.dish_id?.price}
                </td>
                <td className={styles.tableCellAmount}>
                  {(item.dish_id?.price * item.quantity)}
                </td>
              </tr>
            ))}
            {/* Thêm dòng trống để bảng không bị ngắn nếu ít item */}
            {[...Array(6 - (orderItems.length || 0))].map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className={styles.tableCellDescription}>&nbsp;</td>
                <td className={styles.tableCellMonths}>&nbsp;</td>
                <td className={styles.tableCellUnitPrice}>&nbsp;</td>
                <td className={styles.tableCellAmount}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className={styles.tableFooterTotalLabel}>
                Tổng
              </td>
              <td className={styles.tableFooterTotalAmount}>${totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div >
  );
};

export default InvoiceOverlay;
