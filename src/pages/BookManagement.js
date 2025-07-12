import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import BookModal from '../components/BookModal';
import './BookManagement.css';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockBooks = [
        {
          id: 1,
          title: 'Đắc Nhân Tâm',
          author: 'Dale Carnegie',
          isbn: '978-604-1-00001-1',
          category: 'Kỹ năng sống',
          publisher: 'NXB Tổng hợp TP.HCM',
          publishYear: 2019,
          quantity: 5,
          available: 3,
          location: 'Kệ A1'
        },
        {
          id: 2,
          title: 'Nhà Giả Kim',
          author: 'Paulo Coelho',
          isbn: '978-604-1-00002-2',
          category: 'Tiểu thuyết',
          publisher: 'NXB Văn học',
          publishYear: 2020,
          quantity: 3,
          available: 1,
          location: 'Kệ B2'
        },
        {
          id: 3,
          title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
          author: 'Rosie Nguyễn',
          isbn: '978-604-1-00003-3',
          category: 'Kỹ năng sống',
          publisher: 'NXB Hội nhà văn',
          publishYear: 2018,
          quantity: 4,
          available: 2,
          location: 'Kệ A3'
        },
        {
          id: 4,
          title: 'Cách Nghĩ Để Thành Công',
          author: 'Napoleon Hill',
          isbn: '978-604-1-00004-4',
          category: 'Kinh doanh',
          publisher: 'NXB Lao động',
          publishYear: 2021,
          quantity: 6,
          available: 4,
          location: 'Kệ C1'
        },
        {
          id: 5,
          title: 'Đọc Vị Bất Kỳ Ai',
          author: 'David J. Lieberman',
          isbn: '978-604-1-00005-5',
          category: 'Tâm lý học',
          publisher: 'NXB Thế giới',
          publishYear: 2020,
          quantity: 2,
          available: 0,
          location: 'Kệ B3'
        }
      ];
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleAddBook = () => {
    setEditingBook(null);
    setShowModal(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      setBooks(books.filter(book => book.id !== bookId));
    }
  };

  const handleSaveBook = (bookData) => {
    if (editingBook) {
      // Update existing book
      setBooks(books.map(book => 
        book.id === editingBook.id ? { ...bookData, id: editingBook.id } : book
      ));
    } else {
      // Add new book
      const newBook = {
        ...bookData,
        id: Math.max(...books.map(b => b.id)) + 1
      };
      setBooks([...books, newBook]);
    }
    setShowModal(false);
    setEditingBook(null);
  };

  const getStatusBadge = (available, quantity) => {
    if (available === 0) {
      return <span className="badge badge-danger">Hết sách</span>;
    } else if (available < quantity) {
      return <span className="badge badge-warning">Còn ít</span>;
    } else {
      return <span className="badge badge-success">Có sẵn</span>;
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
    <div className="book-management">
      <div className="page-header">
        <h1 className="page-title">Quản lý sách</h1>
        <p className="page-subtitle">Quản lý thông tin sách trong thư viện</p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm sách theo tên, tác giả hoặc ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddBook}>
            <FaPlus /> Thêm sách mới
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>ISBN</th>
                <th>Thể loại</th>
                <th>Số lượng</th>
                <th>Còn lại</th>
                <th>Vị trí</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>#{book.id.toString().padStart(4, '0')}</td>
                  <td>
                    <div className="book-title-cell">
                      <strong>{book.title}</strong>
                      <small>{book.publisher} - {book.publishYear}</small>
                    </div>
                  </td>
                  <td>{book.author}</td>
                  <td>{book.isbn}</td>
                  <td>{book.category}</td>
                  <td>{book.quantity}</td>
                  <td>{book.available}</td>
                  <td>{book.location}</td>
                  <td>{getStatusBadge(book.available, book.quantity)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditBook(book)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteBook(book.id)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBooks.length === 0 && (
          <div className="empty-state">
            <h3>Không tìm thấy sách</h3>
            <p>Không có sách nào phù hợp với từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>

      {showModal && (
        <BookModal
          book={editingBook}
          onSave={handleSaveBook}
          onClose={() => {
            setShowModal(false);
            setEditingBook(null);
          }}
        />
      )}
    </div>
  );
};

export default BookManagement; 