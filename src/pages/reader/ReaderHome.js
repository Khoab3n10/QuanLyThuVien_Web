import React, { useState, useEffect } from 'react';
import { FaBook, FaClock, FaCheck, FaExclamationTriangle, FaSearch, FaUser, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './ReaderHome.css';

const ReaderHome = () => {
  const [readerInfo, setReaderInfo] = useState(null);
  const [currentBorrows, setCurrentBorrows] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setReaderInfo({
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        memberSince: '2023-01-15',
        totalBorrows: 15,
        currentBorrows: 2,
        overdueBooks: 0,
        fines: 0
      });

      setCurrentBorrows([
        {
          id: 1,
          bookTitle: 'Đắc Nhân Tâm',
          author: 'Dale Carnegie',
          borrowDate: '2024-01-15',
          returnDate: '2024-02-15',
          daysLeft: 5,
          status: 'borrowed',
          category: 'Kỹ năng sống',
          location: 'Kệ A1'
        },
        {
          id: 2,
          bookTitle: 'Nhà Giả Kim',
          author: 'Paulo Coelho',
          borrowDate: '2024-01-20',
          returnDate: '2024-02-20',
          daysLeft: 10,
          status: 'borrowed',
          category: 'Tiểu thuyết',
          location: 'Kệ B2'
        }
      ]);

      setRecentBooks([
        {
          id: 1,
          title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
          author: 'Rosie Nguyễn',
          category: 'Kỹ năng sống',
          available: 3,
          total: 5,
          location: 'Kệ A3'
        },
        {
          id: 2,
          title: 'Cách Nghĩ Để Thành Công',
          author: 'Napoleon Hill',
          category: 'Kinh doanh',
          available: 4,
          total: 6,
          location: 'Kệ C1'
        },
        {
          id: 3,
          title: 'Đọc Vị Bất Kỳ Ai',
          author: 'David J. Lieberman',
          category: 'Tâm lý học',
          available: 2,
          total: 3,
          location: 'Kệ B3'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status, daysLeft) => {
    if (daysLeft < 0) {
      return <span className="badge badge-danger">Quá hạn</span>;
    } else if (daysLeft <= 3) {
      return <span className="badge badge-warning">Sắp hạn</span>;
    } else {
      return <span className="badge badge-success">Bình thường</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="reader-home">
      <div className="page-header">
        <h1 className="page-title">Chào mừng, {readerInfo.name}!</h1>
        <p className="page-subtitle">Quản lý sách và tìm kiếm tài liệu</p>
      </div>

      {/* Reader Info Card */}
      <div className="reader-info-card">
        <div className="reader-avatar">
          <FaUser />
        </div>
        <div className="reader-details">
          <h3>{readerInfo.name}</h3>
          <p>{readerInfo.email}</p>
          <p>Thành viên từ: {formatDate(readerInfo.memberSince)}</p>
        </div>
        <div className="reader-stats">
          <div className="stat">
            <span className="stat-number">{readerInfo.totalBorrows}</span>
            <span className="stat-label">TỔNG LƯỢT MƯỢN</span>
          </div>
          <div className="stat">
            <span className="stat-number">{readerInfo.currentBorrows}</span>
            <span className="stat-label">ĐANG MƯỢN</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Current Borrows */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaBook /> Sách đang mượn
            </h2>
            <Link to="/reader/my-books" className="btn btn-primary">
              Xem tất cả
            </Link>
          </div>
          
          {currentBorrows.length > 0 ? (
            <div className="books-grid">
              {currentBorrows.map((book) => (
                <div key={book.id} className="book-card">
                  <div className="book-info">
                    <h4>{book.bookTitle}</h4>
                    <p className="book-author">{book.author}</p>
                    <p className="book-category">{book.category}</p>
                    <p className="book-location">{book.location}</p>
                    <div className="book-dates">
                      <p>Mượn: {formatDate(book.borrowDate)}</p>
                      <p>Trả: {formatDate(book.returnDate)}</p>
                    </div>
                  </div>
                  <div className="book-status">
                    {getStatusBadge(book.status, book.daysLeft)}
                    <p className="days-left">
                      {book.daysLeft > 0 ? `Còn ${book.daysLeft} ngày` : `Quá hạn ${Math.abs(book.daysLeft)} ngày`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Bạn chưa mượn sách nào</h3>
              <p>Hãy tìm kiếm và mượn sách mới!</p>
              <Link to="/reader/search" className="btn btn-primary">
                <FaSearch /> Tìm kiếm sách
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Thao tác nhanh</h2>
          </div>
          
          <div className="quick-actions">
            <Link to="/reader/search" className="action-card">
              <FaSearch className="action-icon" />
              <h3>Tìm kiếm sách</h3>
              <p>Tìm kiếm sách theo tên, tác giả, thể loại</p>
            </Link>
            
            <Link to="/reader/my-books" className="action-card">
              <FaBook className="action-icon" />
              <h3>Sách của tôi</h3>
              <p>Xem sách đang mượn và lịch sử mượn</p>
            </Link>
            
            <Link to="/reader/reservations" className="action-card">
              <FaCalendar className="action-icon" />
              <h3>Đặt sách</h3>
              <p>Quản lý sách đã đặt và thông báo</p>
            </Link>
            
            <Link to="/reader/fines" className="action-card">
              <FaExclamationTriangle className="action-icon" />
              <h3>Tiền phạt</h3>
              <p>Xem và thanh toán tiền phạt</p>
            </Link>
          </div>
        </div>

        {/* Recent Books */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Sách mới</h2>
            <Link to="/reader/search" className="btn btn-secondary">
              Xem tất cả
            </Link>
          </div>
          
          <div className="books-grid">
            {recentBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-info">
                  <h4>{book.title}</h4>
                  <p className="book-author">{book.author}</p>
                  <p className="book-category">{book.category}</p>
                  <p className="book-location">{book.location}</p>
                </div>
                <div className="book-actions">
                  <span className="availability">
                    {book.available > 0 ? (
                      <span className="badge badge-success">Có sẵn ({book.available})</span>
                    ) : (
                      <span className="badge badge-danger">Hết sách</span>
                    )}
                  </span>
                  <Link to="/reader/search" className="btn btn-primary btn-sm">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderHome; 