import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AdminModule from './components/AdminModule';
import InOutModule from './components/InOutModule';
import UserMenu from './components/UserMenu';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-lg font-semibold">ERP System</span>
                </div>
              </div>
              <div className="flex items-center">
                <UserMenu />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminModule />} />
            <Route path="/inout" element={<InOutModule />} />
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;