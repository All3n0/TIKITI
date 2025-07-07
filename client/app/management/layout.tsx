'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Drawer from '../management/components/Drawer';
import Navbar from '../management/components/Navbar';
import Footer from '@/components/Footer';

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerCollapsed, setDrawerCollapsed] = useState(true);
  const toggleDrawer = () => setDrawerCollapsed(!drawerCollapsed);

  // Check if current route is login or register
  const isAuthPage =
    pathname === '/management/login' || pathname === '/management/register';

  return (
    <html lang="en">
      <body className="bg-white flex flex-col min-h-screen">
        <div className="flex flex-1 w-full bg-white">
          {/* Only show Drawer if not on auth page */}
          {!isAuthPage && (
            <Drawer
              collapsed={drawerCollapsed}
              setCollapsed={setDrawerCollapsed}
            />
          )}

          <div className="flex-1 flex flex-col w-full bg-white">
            {/* Only show Navbar if not on auth page */}
            {!isAuthPage && <Navbar onToggleDrawer={toggleDrawer} />}

            <main className={`flex-1 ${!isAuthPage ? 'pt-16' : ''} bg-white`}>
              {children}
            </main>
          </div>
        </div>

        {/* Only show Footer if not on auth page */}
        {!isAuthPage && <Footer />}
      </body>
    </html>
  );
}
