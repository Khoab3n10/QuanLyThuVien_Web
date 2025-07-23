import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUser, FaKey } from 'react-icons/fa';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = "https://libraryapi20250714182231-dvf7buahgwdmcmg7.southeastasia-01.azurewebsites.net/api/User";

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } else {
        setError('Không thể tải danh sách người dùng');
      }
    } catch (err) {
      setError('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Không thể xóa người dùng');
      }
    } catch (err) {
      alert('Lỗi kết nối');
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt('Nhập mật khẩu mới:');
    if (!newPassword) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });

      if (response.ok) {
        alert('Đặt lại mật khẩu thành công');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Không thể đặt lại mật khẩu');
      }
    } catch (err) {
      alert('Lỗi kết nối');
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'Quản trị viên': 'badge-danger',
      'Thủ thư': 'badge-primary',
      'Kế toán': 'badge-warning',
      'Độc giả': 'badge-success'
    };
    return <span className={`badge ${roleColors[role] || 'badge-secondary'}`}>{role}</span>;
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <span className="badge badge-success">Hoạt động</span> : 
      <span className="badge badge-danger">Không hoạt động</span>;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h1 className="page-title">Quản lý người dùng</h1>
        <p className="page-subtitle">Quản lý tài khoản và phân quyền người dùng</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="page-actions">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddUser}>
          <FaPlus /> Thêm người dùng
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Đăng nhập cuối</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <div className="user-info">
                    <FaUser className="user-icon" />
                    <span>{user.username}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{getRoleBadge(user.role)}</td>
                <td>{getStatusBadge(user.isActive)}</td>
                <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  {user.lastLoginAt ? 
                    new Date(user.lastLoginAt).toLocaleDateString('vi-VN') : 
                    'Chưa đăng nhập'
                  }
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleEditUser(user)}
                      title="Sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleResetPassword(user.id)}
                      title="Đặt lại mật khẩu"
                    >
                      <FaKey />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
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

      {filteredUsers.length === 0 && !loading && (
        <div className="empty-state">
          <FaUser className="empty-icon" />
          <h3>Không có người dùng nào</h3>
          <p>Bắt đầu bằng cách thêm người dùng mới</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 