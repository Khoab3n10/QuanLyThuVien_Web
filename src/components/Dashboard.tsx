import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Library Management System</h1>
          <div className="user-info">
            <span>Welcome, {user?.username} ({user?.role})</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          <h2>Dashboard</h2>
          <p>Welcome to the Library Management System!</p>
          
          <div className="dashboard-cards">
            <div className="card">
              <h3>Books</h3>
              <p>Manage library books and inventory</p>
            </div>
            
            <div className="card">
              <h3>Readers</h3>
              <p>Manage library members and readers</p>
            </div>
            
            <div className="card">
              <h3>Borrowing</h3>
              <p>Handle book borrowing and returns</p>
            </div>
            
            <div className="card">
              <h3>Reports</h3>
              <p>View library statistics and reports</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 