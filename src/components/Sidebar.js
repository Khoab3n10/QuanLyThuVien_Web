import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaUsers, 
  FaExchangeAlt,
  FaChartBar,
  FaUser,
  FaSearch,
  FaHistory,
  FaSignOutAlt,
  FaCog
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  const getMenuItems = () => {
    switch (user.role) {
      case 'Quản trị viên':
        return [
          { path: '/', icon: <FaHome />, label: 'Dashboard' },
          { path: '/books', icon: <FaBook />, label: 'Quản lý sách' },
          { path: '/readers', icon: <FaUsers />, label: 'Quản lý độc giả' },
          { path: '/borrows', icon: <FaExchangeAlt />, label: 'Quản lý mượn trả' },
          { path: '/users', icon: <FaUser />, label: 'Quản lý người dùng' },
        ];
      case 'Thủ thư':
        return [
          { path: '/', icon: <FaHome />, label: 'Dashboard' },
          { path: '/books', icon: <FaBook />, label: 'Quản lý sách' },
          { path: '/readers', icon: <FaUsers />, label: 'Quản lý độc giả' },
          { path: '/borrows', icon: <FaExchangeAlt />, label: 'Quản lý mượn trả' },
        ];
      case 'Kế toán':
        return [
          { path: '/', icon: <FaHome />, label: 'Dashboard' },
          { path: '/borrows', icon: <FaExchangeAlt />, label: 'Quản lý mượn trả' },
        ];
      case 'Độc giả':
        return [
          { path: '/reader', icon: <FaHome />, label: 'Trang chủ' },
          { path: '/reader/search', icon: <FaSearch />, label: 'Tìm kiếm sách' },
          { path: '/reader/my-books', icon: <FaBook />, label: 'Sách của tôi' },
          { path: '/reader/history', icon: <FaHistory />, label: 'Lịch sử mượn' },
          { path: '/reader/profile', icon: <FaUser />, label: 'Thông tin cá nhân' },
        ];
      default:
        return [];
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'Quản trị viên': 'Administrator',
      'Thủ thư': 'Librarian',
      'Kế toán': 'Accountant',
      'Độc giả': 'Reader'
    };
    return roleNames[role] || role;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          <FaChartBar className="sidebar-icon" />
          Quản Lý Thư Viện
        </h1>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <FaUser />
          </div>
          <div className="user-details">
            <p className="user-name">{user.username}</p>
            <p className="user-role">{getRoleDisplayName(user.role)}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 