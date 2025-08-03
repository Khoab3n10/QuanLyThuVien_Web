import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUser,
  FaCalendar,
  FaMapMarkerAlt,
  FaVenusMars,
  FaEnvelope,
  FaPhone,
  FaCreditCard,
  FaSave,
} from "react-icons/fa";

const ReaderModal = ({ reader, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "",
    diaChiLienHe: "",
    email: "",
    soDienThoai: "",
    ngayDangKy: new Date().toISOString().split("T")[0],
    goiDangKy: "",
    tenDG: "active",
  });

  const packageOptions = [
    { value: "thuong", label: "Thường", price: 100000 },
    { value: "vip", label: "VIP", price: 200000 },
    { value: "sinhvien", label: "Sinh viên", price: 50000 },
  ];

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reader) {
      setFormData({
        hoTen: reader.name || "",
        ngaySinh: reader.ngaySinh ? reader.ngaySinh.split("T")[0] : "",
        gioiTinh: reader.gioiTinh || "",
        diaChiLienHe: reader.address || "",
        email: reader.email || "",
        soDienThoai: reader.phone || "",
        ngayDangKy: reader.ngayDangKy
          ? reader.ngayDangKy.split("T")[0]
          : new Date().toISOString().split("T")[0],
        goiDangKy: reader.goiDangKy || "",
        tenDG: reader.status || "active",
      });
    }
  }, [reader]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra họ tên không để trống
    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống";
    }

    // Kiểm tra ngày sinh
    if (!formData.ngaySinh) {
      newErrors.ngaySinh = "Vui lòng chọn ngày sinh";
    } else {
      const birthDate = new Date(formData.ngaySinh);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 6 || age > 100) {
        newErrors.ngaySinh = "Ngày sinh không hợp lệ";
      }
    }

    // Kiểm tra giới tính
    if (!formData.gioiTinh) {
      newErrors.gioiTinh = "Vui lòng chọn giới tính";
    }

    // Kiểm tra email
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email không đúng định dạng";
      }
    }

    // Kiểm tra số điện thoại
    if (formData.soDienThoai) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.soDienThoai.replace(/\s/g, ""))) {
        newErrors.soDienThoai = "Số điện thoại không hợp lệ";
      }
    }

    // Kiểm tra gói đăng ký (bắt buộc cho thành viên mới, tùy chọn cho thành viên hiện có)
    if (!reader && !formData.goiDangKy) {
      newErrors.goiDangKy = "Vui lòng chọn gói đăng ký";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const selectedPackage = packageOptions.find(
        (pkg) => pkg.value === formData.goiDangKy
      );

      // Transform form data to match the expected format for parent
      const transformedData = {
        hoTen: formData.hoTen,
        tenDG: formData.tenDG,
        email: formData.email,
        sdt: formData.soDienThoai,        // Keep consistent field name
        diaChi: formData.diaChiLienHe,    // Keep consistent field name  
        gioiTinh: formData.gioiTinh,
        ngaySinh: formData.ngaySinh,
        goiDangKy: formData.goiDangKy || "thuong",
        ngayDangKy: formData.ngayDangKy,
        phiThanhVien: getPackagePriceValue(formData.goiDangKy),
      };


        const result = await onSave(transformedData);
        
        // Hiển thị thông tin tài khoản nếu có
        if (result && result.accountInfo) {
          const accountMessage = `🎉 Tạo thành viên thành công!\n\n📋 THÔNG TIN TÀI KHOẢN:\n👤 Tên đăng nhập: ${result.accountInfo.username}\n🔑 Mật khẩu: ${result.accountInfo.password}\n\n⚠️ VUI LÒNG LƯU LẠI THÔNG TIN NÀY!\n\n💳 Để kích hoạt gói đăng ký, vui lòng liên hệ thủ thư để thanh toán.`;
          
          // Use a more user-friendly way to display info
          if (window.confirm(accountMessage + "\n\nBạn có muốn sao chép thông tin này không?")) {
            // Copy to clipboard if supported
            if (navigator.clipboard) {
              navigator.clipboard.writeText(`Tên đăng nhập: ${result.accountInfo.username}\nMật khẩu: ${result.accountInfo.password}`);
              alert("✅ Đã sao chép thông tin tài khoản!");
            }
          }
        }

      if (onClose) onClose();
    } catch (error) {
      setErrors({ submit: "Lỗi khi lưu thông tin. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const getPackagePrice = (packageType) => {
    switch (packageType) {
      case "thuong":
        return "100.000₫";
      case "vip":
        return "200.000₫";
      case "sinhvien":
        return "50.000₫";
      default:
        return "";
    }
  };

  const getPackagePriceValue = (packageType) => {
    switch (packageType) {
      case "thuong":
        return 100000;
      case "vip":
        return 200000;
      case "sinhvien":
        return 50000;
      default:
        return 0;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal member-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {reader ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {errors.submit && (
          <div className="error-message">
            <FaTimes />
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="member-form">
          <div className="form-section">
            <h3>Thông tin cá nhân</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hoTen">
                  <FaUser /> Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="hoTen"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên đầy đủ"
                  className={errors.hoTen ? "error" : ""}
                />
                {errors.hoTen && (
                  <span className="error-text">{errors.hoTen}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="ngaySinh">
                  <FaCalendar /> Ngày sinh <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="ngaySinh"
                  name="ngaySinh"
                  value={formData.ngaySinh}
                  onChange={handleChange}
                  className={errors.ngaySinh ? "error" : ""}
                />
                {errors.ngaySinh && (
                  <span className="error-text">{errors.ngaySinh}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gioiTinh">
                  <FaVenusMars /> Giới tính <span className="required">*</span>
                </label>
                <select
                  id="gioiTinh"
                  name="gioiTinh"
                  value={formData.gioiTinh}
                  onChange={handleChange}
                  className={errors.gioiTinh ? "error" : ""}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                {errors.gioiTinh && (
                  <span className="error-text">{errors.gioiTinh}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="diaChiLienHe">
                  <FaMapMarkerAlt /> Địa chỉ liên hệ
                </label>
                <input
                  type="text"
                  id="diaChiLienHe"
                  name="diaChiLienHe"
                  value={formData.diaChiLienHe}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ liên hệ"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="soDienThoai">
                  <FaPhone /> Số điện thoại
                </label>
                <input
                  type="tel"
                  id="soDienThoai"
                  name="soDienThoai"
                  value={formData.soDienThoai}
                  onChange={handleChange}
                  placeholder="0123456789"
                  className={errors.soDienThoai ? "error" : ""}
                />
                {errors.soDienThoai && (
                  <span className="error-text">{errors.soDienThoai}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ngayDangKy">
                  <FaCalendar /> Ngày đăng ký
                </label>
                <input
                  type="date"
                  id="ngayDangKy"
                  name="ngayDangKy"
                  value={formData.ngayDangKy}
                  onChange={handleChange}
                  disabled={!!reader}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tenDG">
                  <FaUser /> Tên độc giả
                </label>
                <select
                  id="tenDG"
                  name="tenDG"
                  value={formData.tenDG}
                  onChange={handleChange}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>{reader ? "Thay đổi gói đăng ký" : "Gói đăng ký"}</h3>
            {reader && formData.goiDangKy && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)",
                  border: "2px solid #667eea",
                  borderRadius: "12px",
                  padding: "15px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaCreditCard
                  style={{ color: "#667eea", fontSize: "1.2rem" }}
                />
                <div>
                  <strong style={{ color: "#1e293b" }}>Gói hiện tại:</strong>
                  <span
                    style={{
                      marginLeft: "8px",
                      padding: "4px 12px",
                      background: "#667eea",
                      color: "white",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                    }}
                  >
                    {formData.goiDangKy === "thuong"
                      ? "Thường"
                      : formData.goiDangKy === "vip"
                      ? "VIP"
                      : formData.goiDangKy === "sinhvien"
                      ? "Sinh viên"
                      : formData.goiDangKy}
                  </span>
                  <span
                    style={{
                      marginLeft: "8px",
                      color: "#667eea",
                      fontWeight: "600",
                    }}
                  >
                    ({getPackagePrice(formData.goiDangKy)})
                  </span>
                </div>
              </div>
            )}
            {reader && (
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.9rem",
                  marginBottom: "15px",
                  fontStyle: "italic",
                }}
              >
                Chọn gói mới để thay đổi gói đăng ký của thành viên này. Để giữ
                nguyên gói hiện tại, không cần thay đổi lựa chọn.
              </p>
            )}
            <div className="package-selection">
              <div className="package-option">
                <input
                  type="radio"
                  id="thuong"
                  name="goiDangKy"
                  value="thuong"
                  checked={formData.goiDangKy === "thuong"}
                  onChange={handleChange}
                />
                <label htmlFor="thuong" className="package-label">
                  <div className="package-info">
                    <span className="package-name">Thường</span>
                    <span className="package-price">100.000₫</span>
                  </div>
                </label>
              </div>

              <div className="package-option">
                <input
                  type="radio"
                  id="vip"
                  name="goiDangKy"
                  value="vip"
                  checked={formData.goiDangKy === "vip"}
                  onChange={handleChange}
                />
                <label htmlFor="vip" className="package-label">
                  <div className="package-info">
                    <span className="package-name">VIP</span>
                    <span className="package-price">200.000₫</span>
                  </div>
                </label>
              </div>

              <div className="package-option">
                <input
                  type="radio"
                  id="sinhvien"
                  name="goiDangKy"
                  value="sinhvien"
                  checked={formData.goiDangKy === "sinhvien"}
                  onChange={handleChange}
                />
                <label htmlFor="sinhvien" className="package-label">
                  <div className="package-info">
                    <span className="package-name">Sinh viên</span>
                    <span className="package-price">50.000₫</span>
                  </div>
                </label>
              </div>
            </div>
            {errors.goiDangKy && (
              <span className="error-text">{errors.goiDangKy}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FaSave />
                  {reader ? "Cập nhật" : "Thêm thành viên"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReaderModal;
