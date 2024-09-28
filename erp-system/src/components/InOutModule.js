import React, { useState, useEffect } from 'react';
import moment from 'moment';

export default function InOutModule() {
  const [isWorking, setIsWorking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEntries();
    let interval;
    if (isWorking) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking, startTime]);

  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/entries', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Nie udało się pobrać wpisów');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas pobierania wpisów');
    }
  };

  const handleStartStop = async () => {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    if (!isWorking) {
      // Start working
      setIsWorking(true);
      setStartTime(Date.now());
      try {
        const response = await fetch('http://localhost:5001/api/entries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ type: 'in', timestamp: currentTime }),
        });
        if (response.ok) {
          setSuccess('Rozpoczęto pracę');
          fetchEntries();
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Nie udało się rozpocząć pracy');
        }
      } catch (err) {
        setError('Wystąpił błąd podczas rozpoczynania pracy');
      }
    } else {
      // Stop working
      setIsWorking(false);
      try {
        const response = await fetch('http://localhost:5001/api/entries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ type: 'out', timestamp: currentTime }),
        });
        if (response.ok) {
          setSuccess('Zakończono pracę');
          fetchEntries();
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Nie udało się zakończyć pracy');
        }
      } catch (err) {
        setError('Wystąpił błąd podczas kończenia pracy');
      }
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h2 className="text-2xl font-semibold mb-5">System wejść/wyjść</h2>
          
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}

          <div className="mb-8 text-center">
            <div className="text-4xl font-bold mb-4">{formatTime(elapsedTime)}</div>
            <button
              onClick={handleStartStop}
              className={`px-6 py-2 rounded-full text-white font-semibold ${isWorking ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isWorking ? 'Stop' : 'Start'}
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Historia wejść/wyjść</h3>
            <ul className="divide-y divide-gray-200">
              {entries.map((entry, index) => {
                const currentDate = new Date(entry.timestamp);
                const nextEntry = entries[index + 1];
                const duration = nextEntry 
                  ? new Date(nextEntry.timestamp) - currentDate 
                  : (entry.type === 'in' ? Date.now() - currentDate : 0);

                return (
                  <li key={entry.id} className="py-2">
                    <div>{entry.type === 'in' ? 'Wejście' : 'Wyjście'} - {currentDate.toLocaleString()}</div>
                    {entry.type === 'in' && (
                      <div className="text-sm text-gray-500">
                        Czas pracy: {formatTime(duration)}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}