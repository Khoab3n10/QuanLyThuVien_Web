import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BookManagement from './pages/BookManagement';
import ReaderManagement from './pages/ReaderManagement';
import BorrowManagement from './pages/BorrowManagement';
import ReaderHome from './pages/reader/ReaderHome';
import ReaderSearch from './pages/reader/ReaderSearch';
import ReaderMyBooks from './pages/reader/ReaderMyBooks';
import ReaderHistory from './pages/reader/ReaderHistory';
import ReaderProfile from './pages/reader/ReaderProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            {/* Admin Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<BookManagement />} />
            <Route path="/readers" element={<ReaderManagement />} />
            <Route path="/borrows" element={<BorrowManagement />} />
            
            {/* Reader Routes */}
            <Route path="/reader" element={<ReaderHome />} />
            <Route path="/reader/search" element={<ReaderSearch />} />
            <Route path="/reader/my-books" element={<ReaderMyBooks />} />
            <Route path="/reader/history" element={<ReaderHistory />} />
            <Route path="/reader/profile" element={<ReaderProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 