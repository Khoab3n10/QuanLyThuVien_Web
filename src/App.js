import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import Dashboard from './pages/Dashboard';
import BookManagement from './pages/BookManagement';
import ReaderManagement from './pages/ReaderManagement';
import BorrowManagement from './pages/BorrowManagement';
import UserManagement from './pages/UserManagement';
import ReaderHome from './pages/reader/ReaderHome';
import ReaderSearch from './pages/reader/ReaderSearch';
import ReaderMyBooks from './pages/reader/ReaderMyBooks';
import ReaderHistory from './pages/reader/ReaderHistory';
import ReaderProfile from './pages/reader/ReaderProfile';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {user ? (
          <>
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content">
              <Routes>
                {/* Admin Routes */}
                <Route path="/" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên', 'Thủ thư', 'Kế toán']}>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/books" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên', 'Thủ thư']}>
                    <BookManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/readers" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên', 'Thủ thư']}>
                    <ReaderManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/borrows" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên', 'Thủ thư']}>
                    <BorrowManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/users" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên']}>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                
                {/* Reader Routes */}
                <Route path="/reader" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderHome />
                  </ProtectedRoute>
                } />
                
                <Route path="/reader/search" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderSearch />
                  </ProtectedRoute>
                } />
                
                <Route path="/reader/my-books" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderMyBooks />
                  </ProtectedRoute>
                } />
                
                <Route path="/reader/history" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderHistory />
                  </ProtectedRoute>
                } />
                
                <Route path="/reader/profile" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderProfile />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </>
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h1>Hệ Thống Quản Lý Thư Viện</h1>
              <p>Vui lòng đăng nhập để tiếp tục</p>
              <button 
                className="login-btn-large"
                onClick={() => setShowLogin(true)}
              >
                Đăng nhập
              </button>
            </div>
          </div>
        )}
        
        <LoginModal 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)} 
          onLogin={handleLogin} 
        />
      </div>
    </Router>
  );
}

export default App; 