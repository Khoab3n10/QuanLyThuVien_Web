import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaMoneyBillWave, FaExclamationTriangle, FaCheck, FaClock, FaHistory } from 'react-icons/fa';
import { MOCK_DATA } from '../../config/api';
import './ReaderFines.css';

const ReaderFines = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  useEffect(() => {
    // Get current user data from localStorage
    const loadUserFines = () => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('ReaderFines - Current user:', currentUser);
      
      // Get fines for current user
      const userFines = currentUser.username && MOCK_DATA.readerFines[currentUser.username]
        ? MOCK_DATA.readerFines[currentUser.username]
        : [];
      
      console.log('User fines:', userFines);
      
      setFines(userFines);
      setLoading(false);
    };

    // Simulate loading delay
    setTimeout(loadUserFines, 600);
  }, []);

  const handlePayFine = (fineId) => {
    setFines(prev => prev.map(fine => 
      fine.id === fineId ? { ...fine, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : fine
    ));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Chưa thanh toán', class: 'status-pending', icon: <FaClock /> },
      paid: { text: 'Đã thanh toán', class: 'status-paid', icon: <FaCheck /> }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const getFineTypeIcon = (type) => {
    return type === 'late_return' ? <FaClock /> : <FaExclamationTriangle />;
  };

  const getFineTypeText = (type) => {
    return type === 'late_return' ? 'Trả trễ' : 'Hư hỏng';
  };

  const totalPending = fines.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fines.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);

  if (loading) {
    return (
      <div className="reader-fines">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="reader-fines">
      <div className="page-header">
        <h1><FaCreditCard /> Quản lý tiền phạt</h1>
        <p>Theo dõi và thanh toán các khoản tiền phạt mượn sách</p>
      </div>

      <div className="fines-summary">
        <div className="summary-card pending">
          <div className="summary-icon">
            <FaExclamationTriangle />
          </div>
          <div className="summary-content">
            <div className="summary-amount">{totalPending.toLocaleString('vi-VN')} VNĐ</div>
            <div className="summary-label">Chưa thanh toán</div>
          </div>
        </div>
        <div className="summary-card paid">
          <div className="summary-icon">
            <FaCheck />
          </div>
          <div className="summary-content">
            <div className="summary-amount">{totalPaid.toLocaleString('vi-VN')} VNĐ</div>
            <div className="summary-label">Đã thanh toán</div>
          </div>
        </div>
        <div className="summary-card total">
          <div className="summary-icon">
            <FaMoneyBillWave />
          </div>
          <div className="summary-content">
            <div className="summary-amount">{(totalPending + totalPaid).toLocaleString('vi-VN')} VNĐ</div>
            <div className="summary-label">Tổng cộng</div>
          </div>
        </div>
      </div>

      <div className="fines-list">
        <h2>Danh sách tiền phạt</h2>
        
        {fines.length === 0 ? (
          <div className="empty-state">
            <FaCreditCard />
            <p>Bạn không có khoản tiền phạt nào</p>
          </div>
        ) : (
          <div className="fines-grid">
            {fines.map(fine => (
              <div key={fine.id} className="fine-card">
                <div className="fine-header">
                  <div className="fine-type">
                    {getFineTypeIcon(fine.fineType)}
                    <span>{getFineTypeText(fine.fineType)}</span>
                  </div>
                  {getStatusBadge(fine.status)}
                </div>
                
                <div className="fine-details">
                  <h3>{fine.bookTitle}</h3>
                  <div className="detail-row">
                    <span className="label">Lý do:</span>
                    <span className="value">{fine.reason}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Ngày hẹn trả:</span>
                    <span className="value">{fine.dueDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Ngày trả thực tế:</span>
                    <span className="value">{fine.returnDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Số ngày trễ:</span>
                    <span className="value">{fine.daysLate} ngày</span>
                  </div>
                  {fine.paidDate && (
                    <div className="detail-row">
                      <span className="label">Ngày thanh toán:</span>
                      <span className="value">{fine.paidDate}</span>
                    </div>
                  )}
                </div>

                <div className="fine-amount">
                  <span className="amount-label">Số tiền:</span>
                  <span className="amount-value">{fine.amount.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                {fine.status === 'pending' && (
                  <div className="fine-actions">
                    <select 
                      value={selectedPaymentMethod} 
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="payment-method-select"
                    >
                      <option value="">Chọn phương thức thanh toán</option>
                      <option value="cash">Tiền mặt</option>
                      <option value="bank">Chuyển khoản</option>
                      <option value="wallet">Ví điện tử</option>
                    </select>
                    <button 
                      className="btn-pay"
                      onClick={() => handlePayFine(fine.id)}
                      disabled={!selectedPaymentMethod}
                    >
                      <FaCreditCard /> Thanh toán
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fines-info">
        <h3>Thông tin về tiền phạt</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>Phạt trả sách trễ</h4>
            <p>5.000 VNĐ/ngày cho mỗi cuốn sách trả trễ</p>
          </div>
          <div className="info-item">
            <h4>Phạt sách hư hỏng</h4>
            <p>Phạt theo giá trị sách hoặc chi phí sửa chữa</p>
          </div>
          <div className="info-item">
            <h4>Phương thức thanh toán</h4>
            <p>Tiền mặt, chuyển khoản ngân hàng, hoặc ví điện tử</p>
          </div>
          <div className="info-item">
            <h4>Thời hạn thanh toán</h4>
            <p>Thanh toán trong vòng 30 ngày kể từ ngày trả sách</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderFines; 