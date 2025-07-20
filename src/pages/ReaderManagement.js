import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import ReaderModal from '../components/ReaderModal';
import './ReaderManagement.css';

const ReaderManagement = () => {
  const [readers, setReaders] = useState([]);
  const [filteredReaders, setFilteredReaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReader, setEditingReader] = useState(null);
  const [loading, setLoading] = useState(true);

const apiUrl =
    "https://libraryapi20250714182231-dvf7buahgwdmcmg7.southeastasia-01.azurewebsites.net/api/DocGia";

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockReaders = [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          phone: '0123456789',
          address: '123 Đường ABC, Quận 1, TP.HCM',
          memberSince: '2023-01-15',
          status: 'active',
          totalBorrows: 15,
          currentBorrows: 2
        },
        {
          id: 2,
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          phone: '0987654321',
          address: '456 Đường XYZ, Quận 2, TP.HCM',
          memberSince: '2023-03-20',
          status: 'active',
          totalBorrows: 8,
          currentBorrows: 0
        },
        {
          id: 3,
          name: 'Lê Văn C',
          email: 'levanc@email.com',
          phone: '0555666777',
          address: '789 Đường DEF, Quận 3, TP.HCM',
          memberSince: '2023-06-10',
          status: 'inactive',
          totalBorrows: 3,
          currentBorrows: 1
        },
        {
          id: 4,
          name: 'Phạm Thị D',
          email: 'phamthid@email.com',
          phone: '0111222333',
          address: '321 Đường GHI, Quận 4, TP.HCM',
          memberSince: '2023-08-05',
          status: 'active',
          totalBorrows: 22,
          currentBorrows: 3
        },
        {
          id: 5,
          name: 'Hoàng Văn E',
          email: 'hoangvane@email.com',
          phone: '0444555666',
          address: '654 Đường JKL, Quận 5, TP.HCM',
          memberSince: '2023-11-12',
          status: 'active',
          totalBorrows: 5,
          currentBorrows: 0
        }
      ];
      setReaders(mockReaders);
      setFilteredReaders(mockReaders);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = readers.filter(reader =>
      reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.phone.includes(searchTerm)
    );
    setFilteredReaders(filtered);
  }, [searchTerm, readers]);

  const handleAddReader = () => {
    setEditingReader(null);
    setShowModal(true);
  };

  const handleEditReader = (reader) => {
    setEditingReader(reader);
    setShowModal(true);
  };

  const handleDeleteReader = (readerId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa độc giả này?')) {
      setReaders(readers.filter(reader => reader.id !== readerId));
    }
  };

  const handleSaveReader = (readerData) => {
    if (editingReader) {
      // Update existing reader
      setReaders(readers.map(reader => 
        reader.id === editingReader.id ? { ...readerData, id: editingReader.id } : reader
      ));
    } else {
      // Add new reader
      const newReader = {
        ...readerData,
        id: Math.max(...readers.map(r => r.id)) + 1,
        memberSince: new Date().toISOString().split('T')[0],
        totalBorrows: 0,
        currentBorrows: 0
      };
      setReaders([...readers, newReader]);
    }
    setShowModal(false);
    setEditingReader(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">Hoạt động</span>;
      case 'inactive':
        return <span className="badge badge-danger">Không hoạt động</span>;
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

  return (
    <div className="reader-management">
      <div className="page-header">
        <h1 className="page-title">Quản lý độc giả</h1>
        <p className="page-subtitle">Quản lý thông tin độc giả trong thư viện</p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm độc giả theo tên, email hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddReader}>
            <FaPlus /> Thêm độc giả mới
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã độc giả</th>
                <th>Thông tin</th>
                <th>Liên hệ</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th>Thống kê</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredReaders.map((reader) => (
                <tr key={reader.id}>
                  <td>#{reader.id.toString().padStart(4, '0')}</td>
                  <td>
                    <div className="reader-info">
                      <div className="reader-avatar">
                        <FaUser />
                      </div>
                      <div className="reader-details">
                        <strong>{reader.name}</strong>
                        <small>{reader.address}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{reader.email}</div>
                      <div>{reader.phone}</div>
                    </div>
                  </td>
                  <td>{reader.memberSince}</td>
                  <td>{getStatusBadge(reader.status)}</td>
                  <td>
                    <div className="stats-info">
                      <div>Tổng: {reader.totalBorrows} lượt</div>
                      <div>Hiện tại: {reader.currentBorrows} cuốn</div>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditReader(reader)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteReader(reader.id)}
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

        {filteredReaders.length === 0 && (
          <div className="empty-state">
            <h3>Không tìm thấy độc giả</h3>
            <p>Không có độc giả nào phù hợp với từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>

      {showModal && (
        <ReaderModal
          reader={editingReader}
          onSave={handleSaveReader}
          onClose={() => {
            setShowModal(false);
            setEditingReader(null);
          }}
        />
      )}
    </div>
  );
};

export default ReaderManagement; 