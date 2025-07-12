import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaBook, FaUser, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import './ReaderSearch.css';

const ReaderSearch = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'Tất cả',
    'Kỹ năng sống',
    'Tiểu thuyết',
    'Kinh doanh',
    'Tâm lý học',
    'Khoa học',
    'Lịch sử',
    'Văn học',
    'Giáo dục',
    'Công nghệ'
  ];

  const availabilityOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'available', label: 'Có sẵn' },
    { value: 'unavailable', label: 'Hết sách' }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockBooks = [
        {
          id: 1,
          title: 'Đắc Nhân Tâm',
          author: 'Dale Carnegie',
          category: 'Kỹ năng sống',
          publisher: 'NXB Tổng hợp TP.HCM',
          publishYear: 2019,
          isbn: '978-604-1-00001-1',
          available: 3,
          total: 5,
          location: 'Kệ A1',
          description: 'Cuốn sách về nghệ thuật đắc nhân tâm, cách ứng xử và giao tiếp hiệu quả.'
        },
        {
          id: 2,
          title: 'Nhà Giả Kim',
          author: 'Paulo Coelho',
          category: 'Tiểu thuyết',
          publisher: 'NXB Văn học',
          publishYear: 2020,
          isbn: '978-604-1-00002-2',
          available: 1,
          total: 3,
          location: 'Kệ B2',
          description: 'Câu chuyện về hành trình tìm kiếm kho báu và ý nghĩa cuộc sống.'
        },
        {
          id: 3,
          title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
          author: 'Rosie Nguyễn',
          category: 'Kỹ năng sống',
          publisher: 'NXB Hội nhà văn',
          publishYear: 2018,
          isbn: '978-604-1-00003-3',
          available: 2,
          total: 4,
          location: 'Kệ A3',
          description: 'Những trải nghiệm và bài học quý giá cho tuổi trẻ.'
        },
        {
          id: 4,
          title: 'Cách Nghĩ Để Thành Công',
          author: 'Napoleon Hill',
          category: 'Kinh doanh',
          publisher: 'NXB Lao động',
          publishYear: 2021,
          isbn: '978-604-1-00004-4',
          available: 4,
          total: 6,
          location: 'Kệ C1',
          description: 'Những nguyên tắc và phương pháp để đạt được thành công.'
        },
        {
          id: 5,
          title: 'Đọc Vị Bất Kỳ Ai',
          author: 'David J. Lieberman',
          category: 'Tâm lý học',
          publisher: 'NXB Thế giới',
          publishYear: 2020,
          isbn: '978-604-1-00005-5',
          available: 0,
          total: 2,
          location: 'Kệ B3',
          description: 'Nghệ thuật đọc hiểu tâm lý và suy nghĩ của người khác.'
        },
        {
          id: 6,
          title: 'Sapiens: Lược Sử Loài Người',
          author: 'Yuval Noah Harari',
          category: 'Lịch sử',
          publisher: 'NXB Thế giới',
          publishYear: 2021,
          isbn: '978-604-1-00006-6',
          available: 2,
          total: 3,
          location: 'Kệ D1',
          description: 'Lịch sử phát triển của loài người từ thời nguyên thủy.'
        }
      ];
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = books;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Filter by availability
    if (selectedAvailability) {
      if (selectedAvailability === 'available') {
        filtered = filtered.filter(book => book.available > 0);
      } else if (selectedAvailability === 'unavailable') {
        filtered = filtered.filter(book => book.available === 0);
      }
    }

    setFilteredBooks(filtered);
  }, [searchTerm, selectedCategory, selectedAvailability, books]);

  const handleRequestBorrow = (bookId) => {
    // In a real app, this would send a request to the server
    alert(`Đã gửi yêu cầu mượn sách ID: ${bookId}. Vui lòng chờ xác nhận từ thủ thư.`);
  };

  const getAvailabilityBadge = (available, total) => {
    if (available === 0) {
      return <span className="badge badge-danger">Hết sách</span>;
    } else if (available < total * 0.3) {
      return <span className="badge badge-warning">Còn ít ({available}/{total})</span>;
    } else {
      return <span className="badge badge-success">Có sẵn ({available}/{total})</span>;
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
    <div className="reader-search">
      <div className="page-header">
        <h1 className="page-title">Tìm kiếm sách</h1>
        <p className="page-subtitle">Tìm kiếm và khám phá kho sách thư viện</p>
      </div>

      <div className="search-filters">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sách, tác giả hoặc ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Thể loại:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Tình trạng:</label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="filter-select"
            >
              {availabilityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="search-results">
        <div className="results-header">
          <h3>Tìm thấy {filteredBooks.length} sách</h3>
          {searchTerm && (
            <p>Kết quả tìm kiếm cho: "{searchTerm}"</p>
          )}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-header">
                  <h4 className="book-title">{book.title}</h4>
                  {getAvailabilityBadge(book.available, book.total)}
                </div>
                
                <div className="book-info">
                  <p className="book-author">
                    <FaUser /> {book.author}
                  </p>
                  <p className="book-category">
                    <FaBook /> {book.category}
                  </p>
                  <p className="book-publisher">
                    <FaCalendar /> {book.publisher} - {book.publishYear}
                  </p>
                  <p className="book-location">
                    <FaMapMarkerAlt /> {book.location}
                  </p>
                  <p className="book-isbn">ISBN: {book.isbn}</p>
                </div>

                <div className="book-description">
                  <p>{book.description}</p>
                </div>

                <div className="book-actions">
                  {book.available > 0 ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleRequestBorrow(book.id)}
                    >
                      Yêu cầu mượn
                    </button>
                  ) : (
                    <button className="btn btn-secondary" disabled>
                      Hết sách
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Không tìm thấy sách</h3>
            <p>Không có sách nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedAvailability('');
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

export default ReaderSearch; 