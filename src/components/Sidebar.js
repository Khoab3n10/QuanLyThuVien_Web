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
  FaSignInAlt
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const adminMenuItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/books', icon: <FaBook />, label: 'Quản lý sách' },
    { path: '/readers', icon: <FaUsers />, label: 'Quản lý độc giả' },
    { path: '/borrows', icon: <FaExchangeAlt />, label: 'Quản lý mượn trả' },
  ];

  const readerMenuItems = [
    { path: '/reader', icon: <FaHome />, label: 'Trang chủ' },
    { path: '/reader/search', icon: <FaSearch />, label: 'Tìm kiếm sách' },
    { path: '/reader/my-books', icon: <FaBook />, label: 'Sách của tôi' },
    { path: '/reader/history', icon: <FaHistory />, label: 'Lịch sử mượn' },
    { path: '/reader/profile', icon: <FaUser />, label: 'Thông tin cá nhân' },
  ];

  // Check if current path is reader section
  const isReaderSection = window.location.pathname.startsWith('/reader');

  const menuItems = isReaderSection ? readerMenuItems : adminMenuItems;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          <FaChartBar className="sidebar-icon" />
          {isReaderSection ? 'Thư Viện' : 'Quản Lý Thư Viện'}
        </h1>
        {isReaderSection && (
          <div className="reader-switch">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => window.location.href = '/'}
            >
              <FaSignInAlt /> Chuyển sang Admin
            </button>
          </div>
        )}
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
            {isReaderSection ? <FaUser /> : <FaUsers />}
          </div>
          <div className="user-details">
            <p className="user-name">
              {isReaderSection ? 'Độc giả' : 'Quản lý thư viện'}
            </p>
            <p className="user-role">
              {isReaderSection ? 'Member' : 'Administrator'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 