import React, { useState, useEffect } from 'react';

export default function AdminModule() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    nazwa_uzytkownika: '',
    email: '',
    haslo: '',
    rola_id: '',
    imie: '',
    nazwisko: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/uzytkownicy', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Nie udało się pobrać listy użytkowników');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas pobierania użytkowników');
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/uzytkownicy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        setSuccess('Użytkownik został pomyślnie utworzony');
        setNewUser({
          nazwa_uzytkownika: '',
          email: '',
          haslo: '',
          rola_id: '',
          imie: '',
          nazwisko: '',
        });
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Nie udało się utworzyć użytkownika');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas tworzenia użytkownika');
    }
  };

  const handleRoleChange = async (userId, newRoleId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/uzytkownicy/${userId}/rola`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rola_id: newRoleId }),
      });
      if (response.ok) {
        setSuccess('Rola użytkownika została pomyślnie zmieniona');
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Nie udało się zmienić roli użytkownika');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas zmiany roli użytkownika');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h2 className="text-2xl font-semibold mb-5">Moduł Administratora</h2>
          
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}

          <form onSubmit={handleSubmit} className="mb-5">
            <h3 className="text-lg font-semibold mb-3">Dodaj nowego użytkownika</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="nazwa_uzytkownika"
                value={newUser.nazwa_uzytkownika}
                onChange={handleInputChange}
                placeholder="Nazwa użytkownika"
                className="border rounded px-3 py-2"
                required
              />
              <input
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border rounded px-3 py-2"
                required
              />
              <input
                name="haslo"
                type="password"
                value={newUser.haslo}
                onChange={handleInputChange}
                placeholder="Hasło"
                className="border rounded px-3 py-2"
                required
              />
              <select
                name="rola_id"
                value={newUser.rola_id}
                onChange={handleInputChange}
                className="border rounded px-3 py-2"
                required
              >
                <option value="">Wybierz rolę</option>
                <option value="1">Superadmin</option>
                <option value="2">Właściciel</option>
                <option value="3">Handlowiec</option>
                <option value="4">Pracownik</option>
              </select>
              <input
                name="imie"
                value={newUser.imie}
                onChange={handleInputChange}
                placeholder="Imię"
                className="border rounded px-3 py-2"
                required
              />
              <input
                name="nazwisko"
                value={newUser.nazwisko}
                onChange={handleInputChange}
                placeholder="Nazwisko"
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Dodaj użytkownika
            </button>
          </form>

          <div>
            <h3 className="text-lg font-semibold mb-3">Lista użytkowników</h3>
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.id} className="py-2 flex justify-between items-center">
                  <span>{user.imie} {user.nazwisko} - {user.email}</span>
                  <select
                    value={user.rola_id}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="1">Superadmin</option>
                    <option value="2">Właściciel</option>
                    <option value="3">Handlowiec</option>
                    <option value="4">Pracownik</option>
                  </select>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}