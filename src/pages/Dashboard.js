import React, { useState, useEffect } from 'react';
import { FaBook, FaUsers, FaExchangeAlt, FaChartLine } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReaders: 0,
    booksBorrowed: 0,
    booksOverdue: 0
  });

  const [recentBorrows, setRecentBorrows] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = "https://libraryapi20250714182231-dvf7buahgwdmcmg7.southeastasia-01.azurewebsites.net/api";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch summary data
        const summaryResponse = await fetch(`${apiUrl}/Dashboard/summary`);
        if (!summaryResponse.ok) throw new Error('Failed to fetch summary data');
        const summaryData = await summaryResponse.json();
        
        setStats({
          totalBooks: summaryData.totalBooks,
          totalReaders: summaryData.totalReaders,
          booksBorrowed: summaryData.booksBorrowed,
          booksOverdue: summaryData.booksOverdue
        });

        // Fetch recent borrows
        const borrowsResponse = await fetch(`${apiUrl}/PhieuMuon`);
        if (!borrowsResponse.ok) throw new Error('Failed to fetch recent borrows');
        const borrowsData = await borrowsResponse.json();
        
        // Get only the last 5 borrows and map them
        const recentBorrowsData = borrowsData
          .sort((a, b) => new Date(b.ngayMuon) - new Date(a.ngayMuon))
          .slice(0, 5)
          .map(borrow => ({
            id: borrow.id,
            readerName: borrow.docGia?.tenDocGia || borrow.tenDocGia || "",
            bookTitle: borrow.sach?.tenSach || borrow.tenSach || "",
            borrowDate: new Date(borrow.ngayMuon).toISOString().split('T')[0],
            returnDate: new Date(borrow.hanTra).toISOString().split('T')[0],
            status: borrow.ngayTra ? 'returned' : 
                   new Date(borrow.hanTra) < new Date() ? 'overdue' : 'borrowed'
          }));
        
        setRecentBorrows(recentBorrowsData);

        // Fetch popular books (most borrowed)
        const booksResponse = await fetch(`${apiUrl}/Sach`);
        if (!booksResponse.ok) throw new Error('Failed to fetch books');
        const booksData = await booksResponse.json();
        
        // Calculate borrow count for each book from PhieuMuon data
        const bookBorrowCounts = borrowsData.reduce((acc, borrow) => {
          const bookId = borrow.idSach;
          acc[bookId] = (acc[bookId] || 0) + 1;
          return acc;
        }, {});

        // Get top 5 most borrowed books
        const popularBooksData = booksData
          .map(book => ({
            title: book.tenSach,
            author: book.tacGia,
            borrows: bookBorrowCounts[book.id] || 0
          }))
          .sort((a, b) => b.borrows - a.borrows)
          .slice(0, 5);

        setPopularBooks(popularBooksData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>Có lỗi xảy ra</h2>
        <p>{error}</p>
      </div>
    );
  }

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
        </div>
        
        <div className="stat-card">
          <h3>Độc giả đăng ký</h3>
          <div className="stat-value">{stats.totalReaders.toLocaleString()}</div>
        </div>
        
        <div className="stat-card">
          <h3>Sách đang mượn</h3>
          <div className="stat-value">{stats.booksBorrowed.toLocaleString()}</div>
        </div>
        
        <div className="stat-card">
          <h3>Sách quá hạn</h3>
          <div className="stat-value">{stats.booksOverdue.toLocaleString()}</div>
        </div>
      </div>

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
  );
};

export default Dashboard; 