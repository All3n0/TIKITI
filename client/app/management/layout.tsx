'use client';
import { useState } from 'react';
import Drawer from '../management/components/Drawer';
import Navbar from '../management/components/Navbar';
import Footer from '@/components/Footer';

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  const [drawerCollapsed, setDrawerCollapsed] = useState(true);

  const toggleDrawer = () => setDrawerCollapsed(!drawerCollapsed);

  return (
    <html lang="en">
      <body className="bg-white flex flex-col min-h-screen">
        <div className="flex flex-1 w-full bg-white">
          <Drawer collapsed={drawerCollapsed} setCollapsed={setDrawerCollapsed} />
          <div className="flex-1 flex flex-col w-full bg-white">
            <Navbar onToggleDrawer={toggleDrawer} />
            <main className="flex-1 pt-16 bg-white">{children}</main>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
