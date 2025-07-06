'use client';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [manager, setManager] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5557/management/session', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setManager(data))
      .catch(err => console.error('Session fetch error:', err));
  }, []);

  return (
    <header className="bg-teal-800 text-white px-6 py-4 shadow flex justify-between items-center">
      <h1 className="text-lg font-semibold">Management Panel</h1>
      {manager && <span className="font-Bold text-amber-400">Welcome, {manager.name}</span>}
    </header>
  );
}
