import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaUsers, 
  FaExchangeAlt,
  FaChartBar 
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/books', icon: <FaBook />, label: 'Quản lý sách' },
    { path: '/readers', icon: <FaUsers />, label: 'Quản lý độc giả' },
    { path: '/borrows', icon: <FaExchangeAlt />, label: 'Quản lý mượn trả' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          <FaChartBar className="sidebar-icon" />
          Thư Viện
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
            <FaUsers />
          </div>
          <div className="user-details">
            <p className="user-name">Quản lý thư viện</p>
            <p className="user-role">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 