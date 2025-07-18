import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import BookModal from "../components/BookModal";
import "./BookManagement.css";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl =
    "https://libraryapi20250714182231-dvf7buahgwdmcmg7.southeastasia-01.azurewebsites.net/api/Sach";

  // Tải dữ liệu sách từ API
  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const mappedBooks = data.map((book) => ({
          id: book.id,
          title: book.tenSach,
          author: book.tacGia,
          isbn: book.isbn,
          category: book.theLoai,
          publisher: book.nhaXuatBan,
          publishYear: book.namXuatBan,
          quantity: book.soLuong,
          available: book.soLuongCoLai,
          location: book.viTriLuuTru,
        }));
        setBooks(mappedBooks);
        setFilteredBooks(mappedBooks);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải sách:", err);
        setLoading(false);
      });
  }, []);

  // Lọc sách khi tìm kiếm
  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        (book.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (book.author?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (book.isbn || "").includes(searchTerm)
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
    if (window.confirm("Bạn có chắc chắn muốn xóa sách này?")) {
      fetch(`${apiUrl}/${bookId}`, {
        method: "DELETE",
      })
        .then(() => {
          const updatedBooks = books.filter((book) => book.id !== bookId);
          setBooks(updatedBooks);
          setFilteredBooks(updatedBooks);
        })
        .catch((err) => console.error("Lỗi khi xóa sách:", err));
    }
  };

  const isValidIsbn = (isbn) => {
    const cleaned = isbn.replace(/-/g, "").trim();
    const regex = /^(978|979)\d{10}$/;
    return regex.test(cleaned);
  };

  const handleSaveBook = (bookData) => {
    if (!isValidIsbn(bookData.isbn)) {
      alert("Mã ISBN không hợp lệ. Vui lòng nhập đúng chuẩn Việt Nam.");
      return;
    }

    const requestData = {
      tenSach: bookData.title,
      tacGia: bookData.author,
      isbn: bookData.isbn,
      theLoai: bookData.category,
      nhaXuatBan: bookData.publisher,
      namXuatBan: bookData.publishYear,
      soLuong: bookData.quantity,
      soLuongCoLai: bookData.available,
      viTriLuuTru: bookData.location,
    };

    if (editingBook) {
      // Cập nhật
      fetch(`${apiUrl}/${editingBook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...requestData, id: editingBook.id }),
      })
        .then((res) => res.json())
        .then(() => refreshBooks());
    } else {
      // Thêm mới
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })
        .then((res) => res.json())
        .then(() => refreshBooks());
    }

    setShowModal(false);
    setEditingBook(null);
  };

  const refreshBooks = () => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const mappedBooks = data.map((book) => ({
          id: book.id,
          title: book.tenSach,
          author: book.tacGia,
          isbn: book.isbn,
          category: book.theLoai,
          publisher: book.nhaXuatBan,
          publishYear: book.namXuatBan,
          quantity: book.soLuong,
          available: book.soLuongCoLai,
          location: book.viTriLuuTru,
        }));
        setBooks(mappedBooks);
        setFilteredBooks(mappedBooks);
      });
  };

  const getStatusBadge = (available, quantity) => {
    if (available === 0)
      return <span className="badge badge-danger">Hết sách</span>;
    if (available < quantity)
      return <span className="badge badge-warning">Còn ít</span>;
    return <span className="badge badge-success">Có sẵn</span>;
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
                  <td>#{book.id.toString().padStart(4, "0")}</td>
                  <td>
                    <div className="book-title-cell">
                      <strong>{book.title}</strong>
                      <small>
                        {book.publisher} - {book.publishYear}
                      </small>
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
