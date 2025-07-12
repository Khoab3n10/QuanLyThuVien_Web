import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import BorrowModal from '../components/BorrowModal';
import './BorrowManagement.css';

const BorrowManagement = () => {
  const [borrows, setBorrows] = useState([]);
  const [filteredBorrows, setFilteredBorrows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBorrow, setEditingBorrow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockBorrows = [
        {
          id: 1,
          readerId: 1,
          readerName: 'Nguyễn Văn A',
          bookId: 1,
          bookTitle: 'Đắc Nhân Tâm',
          borrowDate: '2024-01-15',
          returnDate: '2024-02-15',
          actualReturnDate: null,
          status: 'borrowed',
          notes: 'Sách mượn cho nghiên cứu'
        },
        {
          id: 2,
          readerId: 2,
          readerName: 'Trần Thị B',
          bookId: 2,
          bookTitle: 'Nhà Giả Kim',
          borrowDate: '2024-01-14',
          returnDate: '2024-02-14',
          actualReturnDate: '2024-01-25',
          status: 'returned',
          notes: 'Đã trả đúng hạn'
        },
        {
          id: 3,
          readerId: 3,
          readerName: 'Lê Văn C',
          bookId: 3,
          bookTitle: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
          borrowDate: '2024-01-13',
          returnDate: '2024-02-13',
          actualReturnDate: null,
          status: 'overdue',
          notes: 'Quá hạn trả sách'
        },
        {
          id: 4,
          readerId: 4,
          readerName: 'Phạm Thị D',
          bookId: 4,
          bookTitle: 'Cách Nghĩ Để Thành Công',
          borrowDate: '2024-01-20',
          returnDate: '2024-02-20',
          actualReturnDate: null,
          status: 'borrowed',
          notes: 'Sách mượn cho học tập'
        },
        {
          id: 5,
          readerId: 5,
          readerName: 'Hoàng Văn E',
          bookId: 5,
          bookTitle: 'Đọc Vị Bất Kỳ Ai',
          borrowDate: '2024-01-18',
          returnDate: '2024-02-18',
          actualReturnDate: '2024-01-30',
          status: 'returned',
          notes: 'Trả sớm'
        }
      ];
      setBorrows(mockBorrows);
      setFilteredBorrows(mockBorrows);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = borrows.filter(borrow =>
      borrow.readerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrow.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrow.status.includes(searchTerm.toLowerCase())
    );
    setFilteredBorrows(filtered);
  }, [searchTerm, borrows]);

  const handleAddBorrow = () => {
    setEditingBorrow(null);
    setShowModal(true);
  };

  const handleEditBorrow = (borrow) => {
    setEditingBorrow(borrow);
    setShowModal(true);
  };

  const handleDeleteBorrow = (borrowId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu mượn này?')) {
      setBorrows(borrows.filter(borrow => borrow.id !== borrowId));
    }
  };

  const handleReturnBook = (borrowId) => {
    const updatedBorrows = borrows.map(borrow => {
      if (borrow.id === borrowId) {
        return {
          ...borrow,
          status: 'returned',
          actualReturnDate: new Date().toISOString().split('T')[0]
        };
      }
      return borrow;
    });
    setBorrows(updatedBorrows);
  };

  const handleSaveBorrow = (borrowData) => {
    if (editingBorrow) {
      // Update existing borrow
      setBorrows(borrows.map(borrow => 
        borrow.id === editingBorrow.id ? { ...borrowData, id: editingBorrow.id } : borrow
      ));
    } else {
      // Add new borrow
      const newBorrow = {
        ...borrowData,
        id: Math.max(...borrows.map(b => b.id)) + 1,
        status: 'borrowed',
        actualReturnDate: null
      };
      setBorrows([...borrows, newBorrow]);
    }
    setShowModal(false);
    setEditingBorrow(null);
  };

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

  const isOverdue = (returnDate) => {
    return new Date(returnDate) < new Date();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="borrow-management">
      <div className="page-header">
        <h1 className="page-title">Quản lý mượn trả</h1>
        <p className="page-subtitle">Quản lý phiếu mượn trả sách trong thư viện</p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên độc giả, tên sách hoặc trạng thái..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddBorrow}>
            <FaPlus /> Thêm phiếu mượn
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Độc giả</th>
                <th>Sách</th>
                <th>Ngày mượn</th>
                <th>Hạn trả</th>
                <th>Ngày trả thực</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrows.map((borrow) => (
                <tr key={borrow.id} className={isOverdue(borrow.returnDate) && borrow.status === 'borrowed' ? 'overdue-row' : ''}>
                  <td>#{borrow.id.toString().padStart(4, '0')}</td>
                  <td>
                    <div className="borrow-reader">
                      <strong>{borrow.readerName}</strong>
                      <small>ID: #{borrow.readerId}</small>
                    </div>
                  </td>
                  <td>
                    <div className="borrow-book">
                      <strong>{borrow.bookTitle}</strong>
                      <small>ID: #{borrow.bookId}</small>
                    </div>
                  </td>
                  <td>{borrow.borrowDate}</td>
                  <td className={isOverdue(borrow.returnDate) && borrow.status === 'borrowed' ? 'overdue-date' : ''}>
                    {borrow.returnDate}
                  </td>
                  <td>{borrow.actualReturnDate || '-'}</td>
                  <td>{getStatusBadge(borrow.status)}</td>
                  <td>
                    <div className="borrow-notes">
                      {borrow.notes || 'Không có ghi chú'}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {borrow.status === 'borrowed' && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleReturnBook(borrow.id)}
                          title="Trả sách"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditBorrow(borrow)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteBorrow(borrow.id)}
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

        {filteredBorrows.length === 0 && (
          <div className="empty-state">
            <h3>Không tìm thấy phiếu mượn</h3>
            <p>Không có phiếu mượn nào phù hợp với từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>

      {showModal && (
        <BorrowModal
          borrow={editingBorrow}
          onSave={handleSaveBorrow}
          onClose={() => {
            setShowModal(false);
            setEditingBorrow(null);
          }}
        />
      )}
    </div>
  );
};

export default BorrowManagement; 