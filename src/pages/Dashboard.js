import React, { useState, useEffect } from 'react';
import { FaBook, FaUsers, FaExchangeAlt, FaChartLine } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReaders: 0,
    totalBorrows: 0,
    overdueBooks: 0
  });

  const [recentBorrows, setRecentBorrows] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalBooks: 1250,
        totalReaders: 320,
        totalBorrows: 89,
        overdueBooks: 12
      });

      setRecentBorrows([
        {
          id: 1,
          readerName: 'Nguyễn Văn A',
          bookTitle: 'Đắc Nhân Tâm',
          borrowDate: '2024-01-15',
          returnDate: '2024-02-15',
          status: 'borrowed'
        },
        {
          id: 2,
          readerName: 'Trần Thị B',
          bookTitle: 'Nhà Giả Kim',
          borrowDate: '2024-01-14',
          returnDate: '2024-02-14',
          status: 'returned'
        },
        {
          id: 3,
          readerName: 'Lê Văn C',
          bookTitle: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
          borrowDate: '2024-01-13',
          returnDate: '2024-02-13',
          status: 'overdue'
        }
      ]);

      setPopularBooks([
        { title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', borrows: 45 },
        { title: 'Nhà Giả Kim', author: 'Paulo Coelho', borrows: 38 },
        { title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', author: 'Rosie Nguyễn', borrows: 32 },
        { title: 'Cách Nghĩ Để Thành Công', author: 'Napoleon Hill', borrows: 28 },
        { title: 'Đọc Vị Bất Kỳ Ai', author: 'David J. Lieberman', borrows: 25 }
      ]);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'borrowed':
        return <span className="badge badge-info">Đang mượn</span>;
      case 'returned':
        return <span className="badge badge-success">Đã trả</span>;
      case 'overdue':
        return <span className="badge badge-danger">Quá hạn</span>;
      default:
        return <span className="badge badge-secondary">Không xác định</span>;
    }
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Tổng quan hệ thống quản lý thư viện</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Tổng số sách</h3>
          <div className="stat-value">{stats.totalBooks.toLocaleString()}</div>
          <div className="stat-change">+12% so với tháng trước</div>
        </div>
        
        <div className="stat-card">
          <h3>Độc giả đăng ký</h3>
          <div className="stat-value">{stats.totalReaders.toLocaleString()}</div>
          <div className="stat-change">+5% so với tháng trước</div>
        </div>
        
        <div className="stat-card">
          <h3>Sách đang mượn</h3>
          <div className="stat-value">{stats.totalBorrows.toLocaleString()}</div>
          <div className="stat-change">+8% so với tháng trước</div>
        </div>
        
        <div className="stat-card">
          <h3>Sách quá hạn</h3>
          <div className="stat-value">{stats.overdueBooks.toLocaleString()}</div>
          <div className="stat-change">-3% so với tháng trước</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Mượn trả gần đây</h2>
            <button className="btn btn-primary">Xem tất cả</button>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Độc giả</th>
                  <th>Sách</th>
                  <th>Ngày mượn</th>
                  <th>Ngày trả</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentBorrows.map((borrow) => (
                  <tr key={borrow.id}>
                    <td>{borrow.readerName}</td>
                    <td>{borrow.bookTitle}</td>
                    <td>{borrow.borrowDate}</td>
                    <td>{borrow.returnDate}</td>
                    <td>{getStatusBadge(borrow.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Sách phổ biến</h2>
          </div>
          
          <div className="popular-books">
            {popularBooks.map((book, index) => (
              <div key={index} className="book-item">
                <div className="book-rank">#{index + 1}</div>
                <div className="book-info">
                  <h4 className="book-title">{book.title}</h4>
                  <p className="book-author">{book.author}</p>
                </div>
                <div className="book-borrows">
                  <span className="borrow-count">{book.borrows} lượt mượn</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 