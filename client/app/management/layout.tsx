'use client';
import Drawer from '../management/components/Drawer';
import Navbar from '../management/components/Navbar';
import Footer from '@/components/Footer';

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white flex flex-col min-h-screen">
        {/* Full-width white container */}
        <div className="flex flex-1 w-full bg-white">
          {/* Drawer will overlay content when expanded */}
          <Drawer />
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col w-full">
            <Navbar />
            <main className="flex-1 pt-16"> {/* flex-1 makes it grow to fill space */}
              {children}
            </main>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}