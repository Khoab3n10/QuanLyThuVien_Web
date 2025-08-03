import React, { useState, useEffect } from 'react';
import { 
  FaClock, 
  FaCheckCircle, 
  FaTimes, 
  FaBook, 
  FaUser, 
  FaCalendar,
  FaMapMarkerAlt,
  FaTrash,
  FaEye
} from 'react-icons/fa';
import { useToast } from '../../hooks';
import reservationService from '../../services/reservationService';
import './ReaderReservations.css';

const ReaderReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [borrowTickets, setBorrowTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reservations');
  const [cancelling, setCancelling] = useState({});
  
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const docGiaId = currentUser.docGiaId || currentUser.userId;

      // Load đặt trước
      const reservationsData = await reservationService.getMyReservations(docGiaId);
      setReservations(reservationsData);

      // Load phiếu mượn (cần tạo API riêng)
      // const borrowData = await borrowService.getMyBorrows(docGiaId);
      // setBorrowTickets(borrowData);

    } catch (error) {
      showToast('Lỗi khi tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      setCancelling(prev => ({ ...prev, [reservationId]: true }));
      
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const docGiaId = currentUser.docGiaId || currentUser.userId;

      const result = await reservationService.cancelReservation(reservationId, docGiaId);
      showToast(result.message, 'success');
      
      // Cập nhật danh sách
      setReservations(prev => prev.filter(r => r.maPhieuDat !== reservationId));
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setCancelling(prev => ({ ...prev, [reservationId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Chờ phê duyệt':
        return <span className="badge badge-warning">⏳ Chờ phê duyệt</span>;
      case 'Đã phê duyệt':
        return <span className="badge badge-success">✅ Đã phê duyệt</span>;
      case 'Từ chối':
        return <span className="badge badge-danger">❌ Từ chối</span>;
      case 'Đang chờ':
        return <span className="badge badge-info">⏱️ Đang chờ</span>;
      case 'Đã xử lý':
        return <span className="badge badge-success">✅ Đã xử lý</span>;
      case 'Đã thông báo':
        return <span className="badge badge-primary">📢 Đã thông báo</span>;
      case 'Quá hạn':
        return <span className="badge badge-danger">⚠️ Quá hạn</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="reader-reservations">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-reservations">
      <div className="page-header">
        <h1 className="page-title">Quản lý đặt mượn sách</h1>
        <p className="page-subtitle">Theo dõi trạng thái đặt trước và phiếu mượn của bạn</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          <FaClock />
          Đặt trước ({reservations.length})
        </button>
        <button 
          className={`tab ${activeTab === 'borrows' ? 'active' : ''}`}
          onClick={() => setActiveTab('borrows')}
        >
          <FaBook />
          Phiếu mượn ({borrowTickets.length})
        </button>
      </div>

      {activeTab === 'reservations' && (
        <div className="reservations-section">
          <h2>Danh sách đặt trước</h2>
          
          {reservations.length === 0 ? (
            <div className="empty-state">
              <h3>Chưa có đặt trước nào</h3>
              <p>Bạn chưa đặt trước sách nào. Hãy tìm kiếm và đặt trước sách bạn muốn mượn.</p>
            </div>
          ) : (
            <div className="reservations-grid">
              {reservations.map((reservation) => (
                <div key={reservation.maPhieuDat} className="reservation-card">
                  <div className="reservation-header">
                    <div className="reservation-status">
                      {getStatusBadge(reservation.trangThai)}
                    </div>
                    <div className="reservation-actions">
                      {reservation.trangThai === 'Đang chờ' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelReservation(reservation.maPhieuDat)}
                          disabled={cancelling[reservation.maPhieuDat]}
                        >
                          <FaTrash />
                          {cancelling[reservation.maPhieuDat] ? 'Đang hủy...' : 'Hủy'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="book-info">
                    <h4 className="book-title">{reservation.sach?.tenSach || 'Không có thông tin'}</h4>
                    <div className="book-details">
                      <div className="detail-item">
                        <FaUser className="detail-icon" />
                        <span>{reservation.sach?.tacGia || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <FaBook className="detail-icon" />
                        <span>{reservation.sach?.theLoai || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <FaMapMarkerAlt className="detail-icon" />
                        <span>{reservation.sach?.viTriLuuTru || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="reservation-details">
                    <div className="detail-item">
                      <FaCalendar className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Ngày đặt:</span>
                        <span className="detail-value">{formatDate(reservation.ngayDat)}</span>
                      </div>
                    </div>
                  </div>

                  {reservation.trangThai === 'Đang chờ' && (
                    <div className="queue-info">
                      <p className="queue-message">
                        <FaClock />
                        Sách hiện không có sẵn. Bạn sẽ được thông báo khi sách có sẵn.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'borrows' && (
        <div className="borrows-section">
          <h2>Phiếu mượn sách</h2>
          
          {borrowTickets.length === 0 ? (
            <div className="empty-state">
              <h3>Chưa có phiếu mượn nào</h3>
              <p>Bạn chưa có phiếu mượn sách nào. Hãy tìm kiếm và mượn sách bạn cần.</p>
            </div>
          ) : (
            <div className="borrows-grid">
              {borrowTickets.map((borrow) => (
                <div key={borrow.maPhieuMuon} className="borrow-card">
                  <div className="borrow-header">
                    <div className="borrow-status">
                      {getStatusBadge(borrow.trangThai)}
                    </div>
                  </div>

                  <div className="book-info">
                    <h4 className="book-title">{borrow.sach?.tenSach || 'Không có thông tin'}</h4>
                    <div className="book-details">
                      <div className="detail-item">
                        <FaUser className="detail-icon" />
                        <span>{borrow.sach?.tacGia || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="borrow-details">
                    <div className="detail-item">
                      <FaCalendar className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Ngày mượn:</span>
                        <span className="detail-value">{formatDate(borrow.ngayMuon)}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaCalendar className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Hạn trả:</span>
                        <span className="detail-value">{formatDate(borrow.hanTra)}</span>
                      </div>
                    </div>
                  </div>

                  {borrow.trangThai === 'borrowed' && (
                    <div className="borrow-actions">
                      <button className="btn btn-primary btn-sm">
                        <FaEye />
                        Xem chi tiết
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReaderReservations; 