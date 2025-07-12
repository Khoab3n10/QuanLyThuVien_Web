import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaEdit, FaSave, FaTimes, FaBook } from 'react-icons/fa';
import './ReaderProfile.css';

const ReaderProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockProfile = {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0123456789',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        memberSince: '2023-01-15',
        memberId: 'R001',
        status: 'active',
        totalBorrows: 15,
        currentBorrows: 2,
        totalBooks: 12,
        overdueBooks: 1
      };
      setProfile(mockProfile);
      setEditForm(mockProfile);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile);
  };

  const handleSave = () => {
    // In a real app, this would send a request to the server
    setProfile(editForm);
    setIsEditing(false);
    alert('Thông tin đã được cập nhật thành công!');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
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
    <div className="reader-profile">
      <div className="page-header">
        <h1 className="page-title">Thông tin cá nhân</h1>
        <p className="page-subtitle">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <div className="profile-info">
            <h2>{profile.name}</h2>
            <p className="member-id">Mã độc giả: {profile.memberId}</p>
            {getStatusBadge(profile.status)}
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button className="btn btn-primary" onClick={handleEdit}>
                <FaEdit /> Chỉnh sửa
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn btn-success" onClick={handleSave}>
                  <FaSave /> Lưu
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  <FaTimes /> Hủy
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-grid">
          {/* Personal Information */}
          <div className="content-section">
            <div className="section-header">
              <h3 className="section-title">
                <FaUser /> Thông tin cá nhân
              </h3>
            </div>
            
            <div className="info-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Họ và tên</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">{profile.name}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">{profile.email}</p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">{profile.phone}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày tham gia</label>
                  <p className="info-value">{profile.memberSince}</p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={editForm.address}
                    onChange={handleChange}
                    className="form-input"
                    rows="3"
                  />
                ) : (
                  <p className="info-value">{profile.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="content-section">
            <div className="section-header">
              <h3 className="section-title">Thống kê mượn sách</h3>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaBook />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{profile.totalBorrows}</div>
                  <div className="stat-label">Tổng lượt mượn</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaCalendar />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{profile.currentBorrows}</div>
                  <div className="stat-label">Đang mượn</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUser />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{profile.totalBooks}</div>
                  <div className="stat-label">Sách đã trả</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaTimes />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{profile.overdueBooks}</div>
                  <div className="stat-label">Sách quá hạn</div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="content-section">
            <div className="section-header">
              <h3 className="section-title">Thông tin tài khoản</h3>
            </div>
            
            <div className="account-info">
              <div className="info-item">
                <label className="info-label">Mã độc giả:</label>
                <span className="info-value">{profile.memberId}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Trạng thái:</label>
                <span className="info-value">{getStatusBadge(profile.status)}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Ngày tham gia:</label>
                <span className="info-value">{profile.memberSince}</span>
              </div>
              <div className="info-item">
                <label className="info-label">Thời gian thành viên:</label>
                <span className="info-value">
                  {Math.floor((new Date() - new Date(profile.memberSince)) / (1000 * 60 * 60 * 24))} ngày
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderProfile; 