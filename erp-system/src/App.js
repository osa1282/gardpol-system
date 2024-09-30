import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import UserMenu from './components/UserMenu';
import AdminModule from './components/AdminModule';
import InOutModule from './components/InOutModule';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Add a loading state

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/uzytkownik', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Błąd pobierania danych użytkownika:', error);
    }
  };

  useEffect(() => {
    const verifyTokenAndFetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const verifyResponse = await fetch('http://localhost:5001/api/verify-token', {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (verifyResponse.ok) {
            setIsAuthenticated(true);
            await fetchUserData();  // Fetch user data after verifying the token
          } else {
            throw new Error('Nieprawidłowy token');
          }
        } catch (error) {
          console.error('Błąd weryfikacji:', error);
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);  // Stop loading after the authentication check
    };

    verifyTokenAndFetchUser();
  }, []);

  const handleLogin = async () => {
    setIsAuthenticated(true);
    await fetchUserData();  // Fetch user data immediately after login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div>Loading...</div>;  // Show a loading screen while checking authentication
  }

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
                {/* Add a unique key based on user ID or some other property */}
                {isAuthenticated && user && <UserMenu key={user?.id || 'no-user'} user={user} onLogout={handleLogout} />}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="admin" element={<AdminModule />} />
              <Route path="inout" element={<InOutModule />} />  {/* Example for admin module */}
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
