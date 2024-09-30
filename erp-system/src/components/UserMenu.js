import React, { useState, useRef, useEffect } from 'react';

export default function UserMenu({ user, onLogout }) {  // Accept user and onLogout as props
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('online');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loadingPasswordChange, setLoadingPasswordChange] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Hasła nie są zgodne');
      return;
    }
    setLoadingPasswordChange(true);
    try {
      const response = await fetch('http://localhost:5001/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ newPassword })
      });
      if (response.ok) {
        setIsChangingPassword(false);
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        alert('Hasło zostało zmienione');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Nie udało się zmienić hasła');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas zmiany hasła');
    } finally {
      setLoadingPasswordChange(false);
    }
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      const response = await fetch('http://localhost:5001/api/user/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setStatus(newStatus);
      } else {
        const errorData = await response.json();
        console.error('Nie udało się zmienić statusu:', errorData.error);
      }
    } catch (err) {
      console.error('Wystąpił błąd podczas zmiany statusu:', err);
    }
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
          <button onClick={() => setIsChangingPassword(true)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
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
          <button onClick={onLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
            Wyloguj się
          </button>
        </div>
      )}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Zmień hasło</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="password"
                  placeholder="Nowe hasło"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <input
                  type="password"
                  placeholder="Potwierdź hasło"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleChangePassword}
                  className={`px-4 py-2 ${loadingPasswordChange ? 'bg-gray-400' : 'bg-blue-500'} text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                  disabled={loadingPasswordChange}
                >
                  {loadingPasswordChange ? 'Zmiana hasła...' : 'Zmień hasło'}
                </button>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
