'use client';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar({
  onToggleDrawer,
  collapsed,
}: {
  onToggleDrawer: () => void;
  collapsed: boolean;
}) {
  const [manager, setManager] = useState<any>(null);

  useEffect(() => {
    fetch('https://servertikiti-production.up.railway.app/management/session', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setManager(data))
      .catch(err => console.error('Session fetch error:', err));
  }, []);

  return (
    <header className="bg-teal-800 text-white px-4 py-4 shadow flex items-center justify-between">
      <div className="flex items-center">
        {/* Toggle button - only shows one icon at a time */}
        <button 
          onClick={onToggleDrawer} 
          className="mr-2 p-2 rounded hover:bg-teal-700"
          aria-label={collapsed ? "Open menu" : "Close menu"}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>

        <h1 className="text-lg font-semibold">Management Panel</h1>
      </div>
      
      {/* <span className="font-bold text-amber-400">Welcome, {manager?.name}</span> */}
    </header>
  );
}