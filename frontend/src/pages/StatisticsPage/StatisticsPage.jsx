import React from 'react';
import styles from './StatisticsPage.module.scss';
import ActiveUsersCard from './components/ActiveUsersCard/ActiveUsersCard';
import PageViewsChart from './components/PageViewsChart/PageViewsChart';
import KPIOverview from './components/KPIOverview/KPIOverview';
import TabsNavigation from './components/TabsNavigation/TabsNavigation';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

import { useState, useEffect } from 'react';
import axios from 'axios';

function StatisticsPage() {
  // fetch order 
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [statusCount, setStatusCount] = useState({

  });
  const [activeTab, setActiveTab] = useState('ngày')

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/time/${activeTab}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStatusCount(res.data.statusCount)
      setOrders(res.data.orders);
      setTotalAmount(res.data.totalAmount);
    } catch (err) {
      console.error('Lỗi khi lấy orders:', err);
    }
  };


  useEffect(() => {
    fetchOrders()
    console.log('orders', orders)
    console.log('statusCount', statusCount)
    console.log('totalAmount', totalAmount)
    console.log('activeTab', activeTab)
  }, [activeTab])

  return (
    <div className={styles.statisticsPageContainer}>
      <Header />
      <div className={styles.contentWrapper}>
        <Sidebar />
        <main className={styles.mainContent}>
          <TabsNavigation
            tabs={['ngày', 'tháng', 'năm']}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
          />
          <div className={styles.cardsGrid}>
            <ActiveUsersCard content="Số lượng đơn đặt bàn" activeUsers={orders.length} />
            <ActiveUsersCard content="Tổng doanh thu" activeUsers={totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} />
          </div>

          <KPIOverview
            statusCount={statusCount}
          />
        </main>
      </div>
    </div>
  );
}

export default StatisticsPage;