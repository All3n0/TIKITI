'use client';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar({ onToggleDrawer }: { onToggleDrawer: () => void }) {
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
    <header className="bg-teal-800 text-white px-4 py-4 shadow flex items-center justify-between">
      {/* Drawer toggle (visible on all screens, especially mobile) */}
      <button onClick={onToggleDrawer} className="md:hidden mr-2 p-2 rounded hover:bg-teal-700">
        <Menu size={20} />
      </button>

      <h1 className="text-lg font-semibold">Management Panel</h1>
      {/* <span className="font-bold text-amber-400">Welcome, {manager?.name}</span> */}
    </header>
  );
}
