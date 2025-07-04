'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CalendarDays,
  Users,
  Ticket,
  FileText,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import React, { useState } from 'react';

const navLinks = [
  { name: 'Dashboard', href: '/organiser/dashboard', icon: Home },
  { name: 'Events', href: '/organiser/events', icon: CalendarDays },
  { name: 'Sponsors', href: '/organiser/sponsors', icon: Users },
  { name: 'Venues', href: '/organiser/venues', icon: Store },
  { name: 'Tickets', href: '/organiser/tickets', icon: Ticket },
  { name: 'Orders', href: '/organiser/orders', icon: FileText },
  { name: 'Refunds', href: '/organiser/refunds', icon: FileText },
  { name: 'Profile', href: '/organiser/profile', icon: Settings },
];

export default function OrganiserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-amber-600 text-white flex flex-col py-6 px-3 transition-all duration-300 ${
          collapsed ? 'w-20 items-center' : 'w-64'
        }`}
      >
        {/* Top Section */}
        <div className="flex justify-between items-center mb-6 w-full">
          {!collapsed && <h2 className="text-xl font-bold">Organizer</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-amber-200 transition"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 w-full">
          {navLinks.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center ${
                collapsed ? 'justify-center' : ''
              } gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                pathname === href
                  ? 'bg-white text-amber-600 font-semibold'
                  : 'hover:bg-amber-500/60'
              }`}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
