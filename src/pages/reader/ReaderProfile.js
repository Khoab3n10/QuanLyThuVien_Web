import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaEdit, FaSave, FaTimes, FaBook } from 'react-icons/fa';
import { MOCK_DATA } from '../../config/api';
import readerService from '../../services/readerService';
import './ReaderProfile.css';

const ReaderProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user data from localStorage
    const loadUserProfile = async () => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('🔍 ReaderProfile - Current user:', currentUser);
      console.log('🔍 DocGia ID:', currentUser.docGiaId);
      
      try {
        // Try to get reader info from DocGia API using docGiaId first
        if (currentUser.docGiaId) {
          console.log('📡 Fetching reader data from DocGia API by ID...');
          const readerData = await readerService.getReaderById(currentUser.docGiaId);
          console.log('✅ DocGia API response by ID:', readerData);
          
          // Map API data to profile format
          const userProfile = {
            id: readerData.id,
            name: readerData.name,
            email: readerData.email,
            phone: readerData.phone,
            address: readerData.address,
            memberSince: readerData.registrationDate,
            memberId: `R${String(readerData.id).padStart(3, '0')}`,
            status: readerData.memberStatus || 'active',
            totalBorrows: 0, // API doesn't provide this, would need separate call
            currentBorrows: 0,
            totalBooks: 0,
            overdueBooks: 0
          };
          
          console.log('📊 Mapped profile from API by ID:', userProfile);
          setProfile(userProfile);
          setEditForm(userProfile);
          setLoading(false);
          return;
        }
        
        // If no docGiaId, try to get reader by username through User table
        if (currentUser.username) {
          console.log('📡 Fetching reader data through User->DocGia link by username...');
          const readerData = await readerService.getReaderByUsername(currentUser.username);
          console.log('✅ DocGia API response by username:', readerData);
          
          // Map API data to profile format
          const userProfile = {
            id: readerData.id,
            name: readerData.name,
            email: readerData.email,
            phone: readerData.phone,
            address: readerData.address,
            memberSince: readerData.registrationDate,
            memberId: `R${String(readerData.id).padStart(3, '0')}`,
            status: readerData.memberStatus || 'active',
            totalBorrows: 0,
            currentBorrows: 0,
            totalBooks: 0,
            overdueBooks: 0
          };
          
          console.log('📊 Mapped profile from API by username:', userProfile);
          setProfile(userProfile);
          setEditForm(userProfile);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log('❌ DocGia API failed:', error.message);
        console.log('🔄 Falling back to mock data...');
      }
      
      // Fallback: Use mock data when API fails or no docGiaId
      console.log('🔍 Available profiles:', Object.keys(MOCK_DATA.readerProfiles));
      
      let userProfile = null;
      if (currentUser.username && MOCK_DATA.readerProfiles[currentUser.username]) {
        userProfile = MOCK_DATA.readerProfiles[currentUser.username];
        console.log('✅ Found mock profile for:', currentUser.username);
      } else {
        console.log('❌ No mock profile found for username:', currentUser.username);
        console.log('🔄 Using default fallback profile');
        // Fallback to default reader profile
        userProfile = MOCK_DATA.readerProfiles['reader'] || {
          id: currentUser.userId || 1,
          name: currentUser.username || 'Unknown User',
          email: currentUser.email || 'unknown@library.com',
          phone: '0123456789',
          address: 'Chưa cập nhật địa chỉ',
          memberSince: '2023-01-15',
          memberId: `R${String(currentUser.userId || 1).padStart(3, '0')}`,
          status: 'active',
          totalBorrows: 0,
          currentBorrows: 0,
          totalBooks: 0,
          overdueBooks: 0
        };
      }
      
      console.log('📊 Final fallback profile:', userProfile);
      setProfile(userProfile);
      setEditForm(userProfile);
      setLoading(false);
    };

    loadUserProfile();
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
            <p className="member-id">Mã thành viên: {profile.memberId}</p>
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
                <label className="info-label">Mã thành viên:</label>
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