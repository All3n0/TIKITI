'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Home, CalendarDays, Ticket, Users, LogOut, Menu, X ,MapPinHouse ,} from 'lucide-react';

const navItems = [
  { href: '/management/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
  { href: '/management/events', icon: <CalendarDays size={18} />, label: 'Events' },
  { href: '/management/tickets', icon: <Ticket size={18} />, label: 'Ticket Types' },
  { href: '/management/orders', icon: <Users size={18} />, label: 'Orders' },
  { href: '/management/venues', icon: <MapPinHouse size={18} />, label: 'venues' },
];

export default function Drawer() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Overlay when drawer is expanded */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Drawer */}
      <aside className={`
        fixed md:relative z-50 min-h-screen bg-teal-800 text-white
        transition-all duration-300 transform
        ${collapsed ? 
          '-translate-x-full md:translate-x-0 w-20' : 
          'translate-x-0 w-64 shadow-xl'
        }
      `}>
        {/* Drawer content remains the same */}
        <div className="p-4 flex items-center justify-between border-b border-teal-700">
          {!collapsed && (
            <h1 className="text-xl font-bold tracking-tight">TIKITI</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-teal-700 transition"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-md transition ${collapsed ? 'justify-center' : ''} hover:bg-teal-700`}
            >
              <span className="text-teal-200">{item.icon}</span>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
          
          <Link
            href="/management/logout"
            className={`flex items-center gap-3 p-3 rounded-md transition ${collapsed ? 'justify-center' : ''} hover:bg-teal-700 mt-8`}
          >
            <LogOut size={18} className="text-teal-200" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </Link>
        </nav>
      </aside>
    </>
  );
}