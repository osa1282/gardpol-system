import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('online');
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChangePassword = () => {
    // Tutaj dodaj logikę zmiany hasła
    console.log('Zmiana hasła');
  };

  const handleChangeStatus = (newStatus) => {
    setStatus(newStatus);
    // Tutaj dodaj logikę zmiany statusu na serwerze
    console.log('Zmiana statusu na:', newStatus);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
      >
        <span className="mr-2">{user.imie} {user.nazwisko}</span>
        <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <button onClick={handleChangePassword} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
            Zmień hasło
          </button>
          <div className="px-4 py-2">
            <span className="text-sm text-gray-700">Status:</span>
            <select
              value={status}
              onChange={(e) => handleChangeStatus(e.target.value)}
              className="ml-2 text-sm text-gray-700"
            >
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
            Wyloguj się
          </button>
        </div>
      )}
    </div>
  );
}