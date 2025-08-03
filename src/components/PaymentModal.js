import React, { useState } from "react";
import { apiRequest } from "../config/api";
// import { API_ENDPOINTS } from "../utils/constants";
import "./PaymentModal.css";

const PaymentModal = ({ isOpen, onClose, reader, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !reader) return null;

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("=== Confirming Payment ===");
      console.log("Reader ID:", reader.id);
      console.log("Member Type:", reader.loaiDocGia);

      const response = await apiRequest("/api/DocGia/ConfirmMembership", {
        method: "POST",
        body: JSON.stringify({
          DocGiaId: reader.id
        }),
      });

      console.log("Payment confirmation response:", response);

      alert(`✅ Kích hoạt gói đăng ký thành công!\n\nThành viên: ${reader.hoTen}\nGói: ${reader.loaiDocGia}\nTrạng thái: Đã thanh toán\nNgày hết hạn: ${new Date(response.ngayHetHan).toLocaleDateString("vi-VN")}`);

      if (onPaymentSuccess) {
        onPaymentSuccess(response);
      }

      onClose();
    } catch (error) {
      console.error("Payment confirmation error:", error);
      setError(`Lỗi kích hoạt gói đăng ký: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPackagePrice = (packageType) => {
    const prices = {
      'Thuong': '100,000',
      'VIP': '300,000', 
      'HocSinh': '50,000'
    };
    return prices[packageType] || '100,000';
  };

  const getPackageDisplayName = (packageType) => {
    const names = {
      'Thuong': 'Thường',
      'VIP': 'VIP',
      'HocSinh': 'Học sinh'
    };
    return names[packageType] || packageType;
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h3>💳 Xác nhận thanh toán gói đăng ký</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="payment-modal-content">
          <div className="member-info">
            <h4>📋 Thông tin thành viên</h4>
            <p><strong>Họ tên:</strong> {reader.hoTen}</p>
            <p><strong>Email:</strong> {reader.email}</p>
            <p><strong>Số điện thoại:</strong> {reader.sdt}</p>
          </div>

          <div className="package-info">
            <h4>📦 Thông tin gói đăng ký</h4>
            <div className="package-details">
              <p><strong>Gói:</strong> {getPackageDisplayName(reader.loaiDocGia)}</p>
              <p><strong>Phí:</strong> {getPackagePrice(reader.loaiDocGia)} VND</p>
              <p><strong>Thời hạn:</strong> 1 năm</p>
              <p><strong>Trạng thái hiện tại:</strong> 
                <span className="status-pending"> Chờ xác nhận</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <div className="payment-actions">
            <button 
              className="cancel-btn" 
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button 
              className="confirm-btn" 
              onClick={handleConfirmPayment}
              disabled={loading}
            >
              {loading ? "⏳ Đang xử lý..." : "✅ Xác nhận đã thanh toán"}
            </button>
          </div>

          <div className="payment-note">
            <p><small>💡 <strong>Lưu ý:</strong> Chỉ xác nhận sau khi thành viên đã thanh toán đầy đủ phí gói đăng ký.</small></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;