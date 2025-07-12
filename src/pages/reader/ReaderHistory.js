import React, { useState, useEffect } from 'react';
import { FaHistory, FaBook, FaCalendar, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import './ReaderHistory.css';

const ReaderHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'returned', label: 'Đã trả' },
    { value: 'overdue', label: 'Quá hạn' },
    { value: 'borrowed', label: 'Đang mượn' }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockHistory = [
        {
          id: 1,
          bookTitle: 'Đắc Nhân Tâm',
          author: 'Dale Carnegie',
          category: 'Kỹ năng sống',
          borrowDate: '2024-01-15',
          returnDate: '2024-02-15',
          actualReturnDate: '2024-02-10',
          status: 'returned',
          daysLate: 0,
          isbn: '978-604-1-00001-1'
        },
        {
          id: 2,
          bookTitle: 'Nhà Giả Kim',
          author: 'Paulo Coelho',
          category: 'Tiểu thuyết',
          borrowDate: '2024-01-20',
          returnDate: '2024-02-20',
          actualReturnDate: null,
          status: 'borrowed',
          daysLate: 0,
          isbn: '978-604-1-00002-2'
        },
        {
          id: 3,
          bookTitle: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
          author: 'Rosie Nguyễn',
          category: 'Kỹ năng sống',
          borrowDate: '2024-01-10',
          returnDate: '2024-02-10',
          actualReturnDate: '2024-02-15',
          status: 'returned',
          daysLate: 5,
          isbn: '978-604-1-00003-3'
        },
        {
          id: 4,
          bookTitle: 'Cách Nghĩ Để Thành Công',
          author: 'Napoleon Hill',
          category: 'Kinh doanh',
          borrowDate: '2023-12-01',
          returnDate: '2024-01-01',
          actualReturnDate: '2024-01-05',
          status: 'returned',
          daysLate: 4,
          isbn: '978-604-1-00004-4'
        },
        {
          id: 5,
          bookTitle: 'Đọc Vị Bất Kỳ Ai',
          author: 'David J. Lieberman',
          category: 'Tâm lý học',
          borrowDate: '2023-11-15',
          returnDate: '2023-12-15',
          actualReturnDate: '2023-12-20',
          status: 'returned',
          daysLate: 5,
          isbn: '978-604-1-00005-5'
        },
        {
          id: 6,
          bookTitle: 'Sapiens: Lược Sử Loài Người',
          author: 'Yuval Noah Harari',
          category: 'Lịch sử',
          borrowDate: '2023-10-01',
          returnDate: '2023-11-01',
          actualReturnDate: '2023-11-10',
          status: 'returned',
          daysLate: 9,
          isbn: '978-604-1-00006-6'
        }
      ];
      setHistory(mockHistory);
      setFilteredHistory(mockHistory);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = history;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.isbn.includes(searchTerm)
      );
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    setFilteredHistory(filtered);
  }, [searchTerm, selectedStatus, history]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'returned':
        return <span className="badge badge-success">Đã trả</span>;
      case 'borrowed':
        return <span className="badge badge-info">Đang mượn</span>;
      case 'overdue':
        return <span className="badge badge-danger">Quá hạn</span>;
      default:
        return <span className="badge badge-secondary">Không xác định</span>;
    }
  };

  const getDaysLateText = (daysLate) => {
    if (daysLate === 0) {
      return <span className="days-on-time">Trả đúng hạn</span>;
    } else {
      return <span className="days-late">Trả muộn {daysLate} ngày</span>;
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
    <div className="reader-history">
      <div className="page-header">
        <h1 className="page-title">Lịch sử mượn sách</h1>
        <p className="page-subtitle">Xem lại lịch sử mượn trả sách của bạn</p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <div className="search-filters">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sách, tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="history-stats">
          <div className="stat-item">
            <div className="stat-number">{history.length}</div>
            <div className="stat-label">Tổng lượt mượn</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {history.filter(item => item.status === 'returned').length}
            </div>
            <div className="stat-label">Đã trả</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {history.filter(item => item.daysLate > 0).length}
            </div>
            <div className="stat-label">Trả muộn</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {history.filter(item => item.status === 'borrowed').length}
            </div>
            <div className="stat-label">Đang mượn</div>
          </div>
        </div>

        {filteredHistory.length > 0 ? (
          <div className="history-list">
            {filteredHistory.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-info">
                  <div className="book-header">
                    <h3 className="book-title">{item.bookTitle}</h3>
                    {getStatusBadge(item.status)}
                  </div>
                  
                  <div className="book-details">
                    <p className="book-author">
                      <strong>Tác giả:</strong> {item.author}
                    </p>
                    <p className="book-category">
                      <strong>Thể loại:</strong> {item.category}
                    </p>
                    <p className="book-isbn">
                      <strong>ISBN:</strong> {item.isbn}
                    </p>
                  </div>

                  <div className="history-dates">
                    <div className="date-row">
                      <FaCalendar />
                      <span><strong>Ngày mượn:</strong> {item.borrowDate}</span>
                    </div>
                    <div className="date-row">
                      <FaBook />
                      <span><strong>Hạn trả:</strong> {item.returnDate}</span>
                    </div>
                    {item.actualReturnDate && (
                      <div className="date-row">
                        <FaCheck />
                        <span><strong>Ngày trả:</strong> {item.actualReturnDate}</span>
                      </div>
                    )}
                    {item.daysLate > 0 && (
                      <div className="date-row late">
                        <FaTimes />
                        <span>{getDaysLateText(item.daysLate)}</span>
                      </div>
                    )}
                    {item.daysLate === 0 && item.status === 'returned' && (
                      <div className="date-row on-time">
                        <FaCheck />
                        <span>Trả đúng hạn</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Không tìm thấy lịch sử</h3>
            <p>Không có lịch sử mượn sách nào phù hợp với tiêu chí tìm kiếm.</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('');
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderHistory; 