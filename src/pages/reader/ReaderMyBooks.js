import React, { useState, useEffect } from 'react';
import { FaBook, FaCalendar, FaClock, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import './ReaderMyBooks.css';

const ReaderMyBooks = () => {
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockMyBooks = [
        {
          id: 1,
          bookTitle: 'Đắc Nhân Tâm',
          author: 'Dale Carnegie',
          category: 'Kỹ năng sống',
          borrowDate: '2024-01-15',
          returnDate: '2024-02-15',
          daysLeft: 5,
          status: 'borrowed',
          isbn: '978-604-1-00001-1',
          location: 'Kệ A1'
        },
        {
          id: 2,
          bookTitle: 'Nhà Giả Kim',
          author: 'Paulo Coelho',
          category: 'Tiểu thuyết',
          borrowDate: '2024-01-20',
          returnDate: '2024-02-20',
          daysLeft: 10,
          status: 'borrowed',
          isbn: '978-604-1-00002-2',
          location: 'Kệ B2'
        },
        {
          id: 3,
          bookTitle: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
          author: 'Rosie Nguyễn',
          category: 'Kỹ năng sống',
          borrowDate: '2024-01-10',
          returnDate: '2024-02-10',
          daysLeft: -2,
          status: 'overdue',
          isbn: '978-604-1-00003-3',
          location: 'Kệ A3'
        }
      ];
      setMyBooks(mockMyBooks);
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

  const handleRenewBook = (bookId) => {
    // In a real app, this would send a request to the server
    alert(`Đã gửi yêu cầu gia hạn sách ID: ${bookId}. Vui lòng chờ xác nhận từ thủ thư.`);
  };

  const handleReturnBook = (bookId) => {
    // In a real app, this would send a request to the server
    if (window.confirm('Bạn có chắc chắn muốn trả sách này?')) {
      setMyBooks(myBooks.filter(book => book.id !== bookId));
      alert('Đã gửi yêu cầu trả sách. Vui lòng mang sách đến thư viện để hoàn tất.');
    }
  };

  const getDaysLeftText = (daysLeft) => {
    if (daysLeft < 0) {
      return `Quá hạn ${Math.abs(daysLeft)} ngày`;
    } else if (daysLeft === 0) {
      return 'Hạn trả hôm nay';
    } else {
      return `Còn ${daysLeft} ngày`;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="reader-my-books">
      <div className="page-header">
        <h1 className="page-title">Sách của tôi</h1>
        <p className="page-subtitle">Quản lý sách đang mượn và lịch trả</p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">
            <FaBook /> Sách đang mượn ({myBooks.length})
          </h2>
        </div>

        {myBooks.length > 0 ? (
          <div className="books-list">
            {myBooks.map((book) => (
              <div key={book.id} className={`book-item ${book.daysLeft < 0 ? 'overdue' : ''}`}>
                <div className="book-info">
                  <div className="book-header">
                    <h3 className="book-title">{book.bookTitle}</h3>
                    {getStatusBadge(book.status, book.daysLeft)}
                  </div>
                  
                  <div className="book-details">
                    <p className="book-author">
                      <strong>Tác giả:</strong> {book.author}
                    </p>
                    <p className="book-category">
                      <strong>Thể loại:</strong> {book.category}
                    </p>
                    <p className="book-isbn">
                      <strong>ISBN:</strong> {book.isbn}
                    </p>
                    <p className="book-location">
                      <strong>Vị trí:</strong> {book.location}
                    </p>
                  </div>

                  <div className="book-dates">
                    <div className="date-item">
                      <FaCalendar />
                      <span><strong>Ngày mượn:</strong> {book.borrowDate}</span>
                    </div>
                    <div className="date-item">
                      <FaClock />
                      <span><strong>Hạn trả:</strong> {book.returnDate}</span>
                    </div>
                    <div className={`date-item ${book.daysLeft < 0 ? 'overdue-text' : ''}`}>
                      <FaExclamationTriangle />
                      <span>{getDaysLeftText(book.daysLeft)}</span>
                    </div>
                  </div>
                </div>

                <div className="book-actions">
                  {book.daysLeft < 0 ? (
                    <div className="overdue-warning">
                      <p>⚠️ Sách đã quá hạn! Vui lòng trả sách sớm.</p>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReturnBook(book.id)}
                      >
                        Trả sách ngay
                      </button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRenewBook(book.id)}
                        disabled={book.daysLeft <= 0}
                      >
                        <FaCheck /> Gia hạn
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleReturnBook(book.id)}
                      >
                        Trả sách
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Bạn chưa mượn sách nào</h3>
            <p>Hãy tìm kiếm và mượn sách mới từ thư viện!</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.href = '/reader/search'}
            >
              <FaBook /> Tìm kiếm sách
            </button>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {myBooks.length > 0 && (
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Tóm tắt</h2>
          </div>
          
          <div className="summary-stats">
            <div className="stat-card">
              <div className="stat-number">{myBooks.length}</div>
              <div className="stat-label">Tổng sách đang mượn</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">
                {myBooks.filter(book => book.daysLeft < 0).length}
              </div>
              <div className="stat-label">Sách quá hạn</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">
                {myBooks.filter(book => book.daysLeft <= 3 && book.daysLeft >= 0).length}
              </div>
              <div className="stat-label">Sắp hạn trả</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">
                {myBooks.filter(book => book.daysLeft > 3).length}
              </div>
              <div className="stat-label">Bình thường</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderMyBooks; 