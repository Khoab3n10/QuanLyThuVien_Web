import React, { useState, useEffect } from 'react';
import { FaBook, FaClock, FaCheck, FaExclamationTriangle, FaSearch, FaUser, FaCalendar, FaMapMarkerAlt, FaInbox } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MOCK_DATA } from '../../config/api';
import readerService from '../../services/readerService';
import './ReaderHome.css';

const ReaderHome = () => {
  const [readerInfo, setReaderInfo] = useState(null);
  const [currentBorrows, setCurrentBorrows] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user data from localStorage
    const loadUserData = async () => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('🏠 ReaderHome - Current user:', currentUser);
      console.log('🏠 DocGia ID:', currentUser.docGiaId);
      
      let userProfile = null;
      
      try {
        // Try to get reader info from DocGia API using docGiaId first
        if (currentUser.docGiaId) {
          console.log('📡 Fetching reader data from DocGia API for home by ID...');
          const readerData = await readerService.getReaderById(currentUser.docGiaId);
          console.log('✅ DocGia API response for home by ID:', readerData);
          
          // Map API data to profile format
          userProfile = {
            id: readerData.id,
            name: readerData.name,
            email: readerData.email,
            memberSince: readerData.registrationDate,
            totalBorrows: 0, // API doesn't provide this, would need separate call
            currentBorrows: 0,
            overdueBooks: 0
          };
          
          console.log('📊 Mapped home profile from API by ID:', userProfile);
        } else if (currentUser.username) {
          // If no docGiaId, try to get reader by username through User table
          console.log('📡 Fetching reader data for home through User->DocGia link by username...');
          const readerData = await readerService.getReaderByUsername(currentUser.username);
          console.log('✅ DocGia API response for home by username:', readerData);
          
          // Map API data to profile format
          userProfile = {
            id: readerData.id,
            name: readerData.name,
            email: readerData.email,
            memberSince: readerData.registrationDate,
            totalBorrows: 0,
            currentBorrows: 0,
            overdueBooks: 0
          };
          
          console.log('📊 Mapped home profile from API by username:', userProfile);
        }
      } catch (error) {
        console.log('❌ DocGia API failed for home:', error.message);
        console.log('🔄 Falling back to mock data for home...');
      }
      
      // Fallback: Use mock data when API fails or no docGiaId
      if (!userProfile) {
        console.log('🏠 Available profiles:', Object.keys(MOCK_DATA.readerProfiles));
        
        if (currentUser.username && MOCK_DATA.readerProfiles[currentUser.username]) {
          userProfile = MOCK_DATA.readerProfiles[currentUser.username];
          console.log('✅ Found mock profile for home:', currentUser.username);
        } else {
          console.log('❌ No mock profile found for username in home:', currentUser.username);
          console.log('🔄 Using default fallback profile for home');
          // Fallback to default reader profile
          userProfile = MOCK_DATA.readerProfiles['reader'] || {
            id: currentUser.userId || 1,
            name: currentUser.username || 'Unknown User',
            email: currentUser.email || 'unknown@library.com',
            totalBorrows: 0,
            currentBorrows: 0,
            overdueBooks: 0,
            memberSince: '2023-01-15'
          };
        }
      }
      
      console.log('🏠 Final home profile:', userProfile);
      
      setReaderInfo({
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        memberSince: userProfile.memberSince,
        totalBorrows: userProfile.totalBorrows,
        currentBorrows: userProfile.currentBorrows,
        overdueBooks: userProfile.overdueBooks,
        fines: 0
      });

      // Get user-specific borrowed books for dashboard preview
      const userBorrowedBooks = currentUser.username && MOCK_DATA.readerBorrowedBooks[currentUser.username]
        ? MOCK_DATA.readerBorrowedBooks[currentUser.username].slice(0, 2) // Show only first 2 books
        : [];
      
      console.log('🏠 User borrowed books for home:', userBorrowedBooks);
      setCurrentBorrows(userBorrowedBooks);

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
    };

    loadUserData();
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
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="reader-home">
      {/* Enhanced Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Chào mừng, {readerInfo.name}!</h1>
          <p className="page-subtitle">Quản lý sách và tìm kiếm tài liệu</p>
        </div>
      </div>

      {/* Reader Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-color': '#10b981', '--stat-color-light': '#059669', '--stat-bg': 'rgba(16, 185, 129, 0.1)' }}>
          <div className="stat-card-header">
            <div className="stat-icon">
              <FaBook />
            </div>
            <div className="stat-content">
              <h3>Tổng lượt mượn</h3>
              <p className="stat-value">{readerInfo.totalBorrows}</p>
              <p className="stat-subtitle">Sách đã mượn</p>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': '#3b82f6', '--stat-color-light': '#2563eb', '--stat-bg': 'rgba(59, 130, 246, 0.1)' }}>
          <div className="stat-card-header">
            <div className="stat-icon">
              <FaInbox />
            </div>
            <div className="stat-content">
              <h3>Đang mượn</h3>
              <p className="stat-value">{readerInfo.currentBorrows}</p>
              <p className="stat-subtitle">Sách hiện tại</p>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': '#f59e0b', '--stat-color-light': '#d97706', '--stat-bg': 'rgba(245, 158, 11, 0.1)' }}>
          <div className="stat-card-header">
            <div className="stat-icon">
              <FaCalendar />
            </div>
            <div className="stat-content">
              <h3>Thành viên từ</h3>
              <p className="stat-value">{formatDate(readerInfo.memberSince)}</p>
              <p className="stat-subtitle">Ngày đăng ký</p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Current Borrows Section */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaBook /> Sách đang mượn
            </h2>
            <div className="section-actions">
              <Link to="/reader/my-books" className="btn btn-primary">
                Xem tất cả
              </Link>
            </div>
          </div>
          
          {currentBorrows.length > 0 ? (
            <div className="cards-grid">
              {currentBorrows.map((book) => (
                <div key={book.id} className="card">
                  <div className="card-header">
                    <div className="card-icon">
                      <FaBook />
                    </div>
                    <div>
                      <h3 className="card-title">{book.bookTitle}</h3>
                      <p className="text-muted mb-0">{book.author}</p>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="flex gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted mb-1">Thể loại</p>
                        <p className="font-medium">{book.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted mb-1">Vị trí</p>
                        <p className="font-medium">{book.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted mb-1">Ngày mượn</p>
                        <p className="font-medium">{formatDate(book.borrowDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted mb-1">Ngày trả</p>
                        <p className="font-medium">{formatDate(book.returnDate)}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      {getStatusBadge(book.status, book.daysLeft)}
                      <p className="text-sm text-muted">
                        {book.daysLeft > 0 ? `Còn ${book.daysLeft} ngày` : `Quá hạn ${Math.abs(book.daysLeft)} ngày`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FaBook />
              </div>
              <h3>Bạn chưa mượn sách nào</h3>
              <p>Hãy tìm kiếm và mượn sách mới!</p>
              <Link to="/reader/search" className="btn btn-primary">
                <FaSearch /> Tìm kiếm sách
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaSearch /> Thao tác nhanh
            </h2>
          </div>
          
          <div className="cards-grid">
            <Link to="/reader/search" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-header">
                <div className="card-icon">
                  <FaSearch />
                </div>
                <h3 className="card-title">Tìm kiếm sách</h3>
              </div>
              <div className="card-content">
                <p>Tìm kiếm sách theo tên, tác giả, thể loại</p>
              </div>
            </Link>
            
            <Link to="/reader/my-books" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-header">
                <div className="card-icon">
                  <FaBook />
                </div>
                <h3 className="card-title">Sách của tôi</h3>
              </div>
              <div className="card-content">
                <p>Xem sách đang mượn và lịch sử mượn</p>
              </div>
            </Link>
            
            <Link to="/reader/reservations" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-header">
                <div className="card-icon">
                  <FaCalendar />
                </div>
                <h3 className="card-title">Đặt sách</h3>
              </div>
              <div className="card-content">
                <p>Quản lý sách đã đặt và thông báo</p>
              </div>
            </Link>
            
            <Link to="/reader/fines" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-header">
                <div className="card-icon">
                  <FaExclamationTriangle />
                </div>
                <h3 className="card-title">Tiền phạt</h3>
              </div>
              <div className="card-content">
                <p>Xem và thanh toán tiền phạt</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Books Section */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaBook /> Sách mới
            </h2>
            <div className="section-actions">
              <Link to="/reader/search" className="btn btn-secondary">
                Xem tất cả
              </Link>
            </div>
          </div>
          
          <div className="cards-grid">
            {recentBooks.map((book) => (
              <div key={book.id} className="card">
                <div className="card-header">
                  <div className="card-icon">
                    <FaBook />
                  </div>
                  <div>
                    <h3 className="card-title">{book.title}</h3>
                    <p className="text-muted mb-0">{book.author}</p>
                  </div>
                </div>
                <div className="card-content">
                  <div className="flex gap-4 mb-3">
                    <div>
                      <p className="text-sm text-muted mb-1">Thể loại</p>
                      <p className="font-medium">{book.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">Vị trí</p>
                      <p className="font-medium">{book.location}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="badge badge-success">
                      Có sẵn ({book.available}/{book.total})
                    </span>
                    <Link to="/reader/search" className="btn btn-primary btn-sm">
                      Xem chi tiết
                    </Link>
                  </div>
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