import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const BorrowModal = ({ borrow, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    readerId: '',
    readerName: '',
    bookId: '',
    bookTitle: '',
    borrowDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    notes: ''
  });

  // Mock data for readers and books
  const mockReaders = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' },
    { id: 3, name: 'Lê Văn C' },
    { id: 4, name: 'Phạm Thị D' },
    { id: 5, name: 'Hoàng Văn E' }
  ];

  const mockBooks = [
    { id: 1, title: 'Đắc Nhân Tâm', available: 3 },
    { id: 2, title: 'Nhà Giả Kim', available: 1 },
    { id: 3, title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', available: 2 },
    { id: 4, title: 'Cách Nghĩ Để Thành Công', available: 4 },
    { id: 5, title: 'Đọc Vị Bất Kỳ Ai', available: 0 }
  ];

  useEffect(() => {
    if (borrow) {
      setFormData(borrow);
    } else {
      // Set default return date (30 days from borrow date)
      const defaultReturnDate = new Date();
      defaultReturnDate.setDate(defaultReturnDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        returnDate: defaultReturnDate.toISOString().split('T')[0]
      }));
    }
  }, [borrow]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill reader name when reader ID changes
    if (name === 'readerId') {
      const reader = mockReaders.find(r => r.id === parseInt(value));
      if (reader) {
        setFormData(prev => ({
          ...prev,
          readerName: reader.name
        }));
      }
    }

    // Auto-fill book title when book ID changes
    if (name === 'bookId') {
      const book = mockBooks.find(b => b.id === parseInt(value));
      if (book) {
        setFormData(prev => ({
          ...prev,
          bookTitle: book.title
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.readerId || !formData.bookId || !formData.borrowDate || !formData.returnDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Check if book is available
    const selectedBook = mockBooks.find(b => b.id === parseInt(formData.bookId));
    if (selectedBook && selectedBook.available <= 0) {
      alert('Sách này hiện không có sẵn để mượn');
      return;
    }

    // Validate dates
    const borrowDate = new Date(formData.borrowDate);
    const returnDate = new Date(formData.returnDate);
    if (returnDate <= borrowDate) {
      alert('Ngày trả phải sau ngày mượn');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {borrow ? 'Chỉnh sửa phiếu mượn' : 'Thêm phiếu mượn mới'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Độc giả *</label>
              <select
                name="readerId"
                value={formData.readerId}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Chọn độc giả</option>
                {mockReaders.map(reader => (
                  <option key={reader.id} value={reader.id}>
                    {reader.name} (ID: #{reader.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sách *</label>
              <select
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Chọn sách</option>
                {mockBooks.map(book => (
                  <option key={book.id} value={book.id} disabled={book.available <= 0}>
                    {book.title} (Còn: {book.available} cuốn)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ngày mượn *</label>
              <input
                type="date"
                name="borrowDate"
                value={formData.borrowDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hạn trả *</label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input"
              placeholder="Ghi chú về phiếu mượn..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {borrow ? 'Cập nhật' : 'Thêm phiếu mượn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowModal; 