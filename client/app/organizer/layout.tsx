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
import React, { useEffect, useState } from 'react';

const navLinks = [
  { name: 'Dashboard', href: '/organizer/dashboard', icon: Home },
  { name: 'Events', href: '/organizer/events', icon: CalendarDays },
  { name: 'Sponsors', href: '/organizer/sponsors', icon: Users },
  { name: 'Venues', href: '/organizer/venues', icon: Store },
  { name: 'Tickets', href: '/organizer/tickets', icon: Ticket },
  { name: 'Orders', href: '/organizer/orders', icon: FileText },
  { name: 'Refunds', href: '/organizer/refunds', icon: FileText },
  { name: 'Profile', href: '/organizer/profile', icon: Settings },
];

export default function OrganiserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true); // default collapsed

  // ✅ Prevent global scroll when drawer is open
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (!collapsed) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
    }

    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
    };
  }, [collapsed]);

  return (
    <div className="relative min-h-screen grid grid-cols-[80px_1fr]">
      {/* Collapsed Sidebar */}
      <aside className="bg-amber-600 text-white flex flex-col items-center py-6 px-2 z-10">
        <button
          onClick={() => setCollapsed(false)}
          className="text-white hover:text-amber-200 transition"
        >
          <ChevronRight size={20} />
        </button>

        <nav className="mt-6 space-y-4">
          {navLinks.map(({ href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex justify-center p-2 rounded-md hover:bg-amber-500/60 ${
                pathname === href ? 'bg-white text-amber-600' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </Link>
          ))}
        </nav>
      </aside>

      {/* Expanded Overlay Drawer */}
      {!collapsed && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
            onClick={() => setCollapsed(true)}
          />

          {/* Drawer */}
          <aside className="fixed top-0 left-0 z-40 w-64 h-full bg-amber-600 text-white flex flex-col py-6 px-4 shadow-lg overflow-hidden">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-xl font-bold">Organizer</h2>
              <button
                onClick={() => setCollapsed(true)}
                className="text-white hover:text-amber-200 transition"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <nav className="space-y-2 shrink-0">
              {navLinks.map(({ name, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                    pathname === href
                      ? 'bg-white text-amber-600 font-semibold'
                      : 'hover:bg-amber-500/60'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="bg-gray-50 p-6 w-full overflow-y-auto">{children}</main>
    </div>
  );
}
