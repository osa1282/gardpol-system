import React from 'react';
import { Link } from 'react-router-dom';

const modules = [
  { name: 'Administracja', icon: '🔧', path: '/admin' },
  { name: 'Kalendarz', icon: '📅', path: '/calendar' },
  { name: 'Zamówienia', icon: '📦', path: '/orders' },
  { name: 'Montaże', icon: '🔨', path: '/installations' },
  { name: 'Klienci', icon: '👥', path: '/clients' },
  { name: 'Zadania', icon: '✅', path: '/todos' },
  { name: 'Lokalizacje pojazdów', icon: '🚗', path: '/vehicles' },
  { name: 'System wejść/wyjść', icon: '🚪', path: '/inout' },
  { name: 'System VOIP', icon: '☎️', path: '/voip' },
  { name: 'Magazyn', icon: '🏭', path: '/warehouse' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {modules.map((module) => (
                <Link
                  key={module.name}
                  to={module.path}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 text-3xl">{module.icon}</div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-lg font-medium text-gray-500 truncate">
                          {module.name}
                        </dt>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}