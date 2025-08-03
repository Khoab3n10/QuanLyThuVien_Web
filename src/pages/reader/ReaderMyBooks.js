import React, { useState, useEffect } from "react";
import {
  FaBook,
  FaCalendar,
  FaClock,
  FaExclamationTriangle,
  FaCheck,
  FaHistory,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MOCK_DATA } from "../../config/api";
import "./ReaderMyBooks.css";

const ReaderMyBooks = () => {
  const [activeTab, setActiveTab] = useState("current"); // 'current' hoặc 'history'
  const [myBooks, setMyBooks] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user data from localStorage
    const loadUserBooks = () => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('ReaderMyBooks - Current user:', currentUser);
      
      // Get borrowed books for current user
      const userBorrowedBooks = currentUser.username && MOCK_DATA.readerBorrowedBooks[currentUser.username] 
        ? MOCK_DATA.readerBorrowedBooks[currentUser.username] 
        : [];
      
      // Get borrow history for current user
      const userBorrowHistory = currentUser.username && MOCK_DATA.readerBorrowHistory[currentUser.username]
        ? MOCK_DATA.readerBorrowHistory[currentUser.username]
        : [];
      
      console.log('User borrowed books:', userBorrowedBooks);
      console.log('User borrow history:', userBorrowHistory);
      
      setMyBooks(userBorrowedBooks);
      setBorrowHistory(userBorrowHistory);
      setLoading(false);
    };

    // Simulate loading delay
    setTimeout(loadUserBooks, 800);
  }, []);

  const getStatusBadge = (status, daysLeft) => {
    if (status === "overdue" || daysLeft < 0) {
      return <span className="badge badge-danger">Quá hạn</span>;
    } else if (daysLeft <= 3) {
      return <span className="badge badge-warning">Sắp hạn</span>;
    } else {
      return <span className="badge badge-success">Bình thường</span>;
    }
  };

  const getHistoryStatusBadge = (status) => {
    switch (status) {
      case "returned":
        return <span className="badge badge-success">Đã trả</span>;
      case "returned_late":
        return <span className="badge badge-warning">Trả trễ</span>;
      default:
        return <span className="badge badge-secondary">Không xác định</span>;
    }
  };

  const handleRenewBook = (bookId) => {
    // In a real app, this would send a request to the server
    alert(
      `Đã gửi yêu cầu gia hạn sách ID: ${bookId}. Vui lòng chờ xác nhận từ Librarian.`
    );
  };

  const handleReturnBook = (bookId) => {
    // In a real app, this would send a request to the server
    if (window.confirm("Bạn có chắc chắn muốn trả sách này?")) {
      setMyBooks(myBooks.filter((book) => book.id !== bookId));
      alert(
        "Đã gửi yêu cầu trả sách. Vui lòng mang sách đến thư viện để hoàn tất."
      );
    }
  };

  const getDaysLeftText = (daysLeft) => {
    if (daysLeft < 0) {
      return `Quá hạn ${Math.abs(daysLeft)} ngày`;
    } else if (daysLeft === 0) {
      return "Hạn trả hôm nay";
    } else {
      return `Còn ${daysLeft} ngày`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
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
        <h1 className="page-title">Quản lý sách của tôi</h1>
        <p className="page-subtitle">Xem sách đang mượn và lịch sử mượn sách</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "current" ? "active" : ""}`}
          onClick={() => setActiveTab("current")}
        >
          <FaBook /> Sách đang mượn ({myBooks.length})
        </button>
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <FaHistory /> Lịch sử mượn ({borrowHistory.length})
        </button>
      </div>

      {/* Current Books Tab */}
      {activeTab === "current" && (
        <div className="tab-content">
          {/* Summary Stats for Current Books */}
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
                    {myBooks.filter((book) => book.daysLeft < 0).length}
                  </div>
                  <div className="stat-label">Sách quá hạn</div>
                </div>

                <div className="stat-card">
                  <div className="stat-number">
                    {
                      myBooks.filter(
                        (book) => book.daysLeft <= 3 && book.daysLeft >= 0
                      ).length
                    }
                  </div>
                  <div className="stat-label">Sắp hạn trả</div>
                </div>

                <div className="stat-card">
                  <div className="stat-number">
                    {myBooks.filter((book) => book.daysLeft > 3).length}
                  </div>
                  <div className="stat-label">Bình thường</div>
                </div>
              </div>
            </div>
          )}

          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">
                <FaBook /> Sách đang mượn
              </h2>
            </div>

            {myBooks.length > 0 ? (
              <div className="books-list">
                {myBooks.map((book) => (
                  <div
                    key={book.id}
                    className={`book-item ${
                      book.daysLeft < 0 ? "overdue" : ""
                    }`}
                  >
                    <div className="book-info">
                      <div className="book-header">
                        <h3 className="book-title">{book.bookTitle}</h3>
                        {getStatusBadge(book.status, book.daysLeft)}
                      </div>

                      <div className="book-details">
                        <p className="book-author">
                          <FaUser /> <strong>Tác giả:</strong> {book.author}
                        </p>
                        <p className="book-category">
                          <FaBook /> <strong>Thể loại:</strong> {book.category}
                        </p>
                        <p className="book-isbn">
                          <strong>ISBN:</strong> {book.isbn}
                        </p>
                        <p className="book-location">
                          <FaMapMarkerAlt /> <strong>Vị trí:</strong>{" "}
                          {book.location}
                        </p>
                      </div>

                      <div className="book-dates">
                        <div className="date-item">
                          <FaCalendar />
                          <span>
                            <strong>Ngày mượn:</strong>{" "}
                            {formatDate(book.borrowDate)}
                          </span>
                        </div>
                        <div className="date-item">
                          <FaClock />
                          <span>
                            <strong>Hạn trả:</strong>{" "}
                            {formatDate(book.returnDate)}
                          </span>
                        </div>
                        <div
                          className={`date-item ${
                            book.daysLeft < 0 ? "overdue-text" : ""
                          }`}
                        >
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
                            disabled={book.daysLeft <= 3}
                          >
                            <FaCheck /> Gia hạn
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
                  onClick={() => (window.location.href = "/reader/search")}
                >
                  <FaBook /> Tìm kiếm sách
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Borrow History Tab */}
      {activeTab === "history" && (
        <div className="tab-content">
          {/* Summary Stats for History */}
          {borrowHistory.length > 0 && (
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Thống kê lịch sử</h2>
              </div>

              <div className="summary-stats">
                <div className="stat-card">
                  <div className="stat-number">{borrowHistory.length}</div>
                  <div className="stat-label">Tổng sách đã mượn</div>
                </div>

                <div className="stat-card">
                  <div className="stat-number">
                    {
                      borrowHistory.filter((book) => book.status === "returned")
                        .length
                    }
                  </div>
                  <div className="stat-label">Trả đúng hạn</div>
                </div>

                <div className="stat-card">
                  <div className="stat-number">
                    {
                      borrowHistory.filter(
                        (book) => book.status === "returned_late"
                      ).length
                    }
                  </div>
                  <div className="stat-label">Trả trễ hạn</div>
                </div>

                <div className="stat-card">
                  <div className="stat-number">
                    {borrowHistory
                      .reduce((total, book) => total + book.fine, 0)
                      .toLocaleString("vi-VN")}{" "}
                    VNĐ
                  </div>
                  <div className="stat-label">Tổng tiền phạt</div>
                </div>
              </div>
            </div>
          )}

          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">
                <FaHistory /> Lịch sử mượn sách
              </h2>
            </div>

            {borrowHistory.length > 0 ? (
              <div className="books-list">
                {borrowHistory.map((book) => (
                  <div
                    key={book.id}
                    className={`book-item history-item ${
                      book.status === "returned_late" ? "late-return" : ""
                    }`}
                  >
                    <div className="book-info">
                      <div className="book-header">
                        <h3 className="book-title">{book.bookTitle}</h3>
                        {getHistoryStatusBadge(book.status)}
                      </div>

                      <div className="book-details">
                        <p className="book-author">
                          <FaUser /> <strong>Tác giả:</strong> {book.author}
                        </p>
                        <p className="book-category">
                          <FaBook /> <strong>Thể loại:</strong> {book.category}
                        </p>
                        <p className="book-isbn">
                          <strong>ISBN:</strong> {book.isbn}
                        </p>
                        <p className="book-location">
                          <FaMapMarkerAlt /> <strong>Vị trí:</strong>{" "}
                          {book.location}
                        </p>
                      </div>

                      <div className="book-dates">
                        <div className="date-item">
                          <FaCalendar />
                          <span>
                            <strong>Ngày mượn:</strong>{" "}
                            {formatDate(book.borrowDate)}
                          </span>
                        </div>
                        <div className="date-item">
                          <FaClock />
                          <span>
                            <strong>Hạn trả:</strong>{" "}
                            {formatDate(book.returnDate)}
                          </span>
                        </div>
                        <div className="date-item">
                          <FaCheck />
                          <span>
                            <strong>Ngày trả:</strong>{" "}
                            {formatDate(book.actualReturnDate)}
                          </span>
                        </div>
                        {book.fine > 0 && (
                          <div className="date-item fine-item">
                            <FaExclamationTriangle />
                            <span>
                              <strong>Tiền phạt:</strong>{" "}
                              {book.fine.toLocaleString("vi-VN")} VNĐ
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>Chưa có lịch sử mượn sách</h3>
                <p>
                  Lịch sử mượn sách sẽ hiển thị ở đây sau khi bạn mượn và trả
                  sách.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderMyBooks;
