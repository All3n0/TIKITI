'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagementDashboard() {
  const [manager, setManager] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const res = await fetch('http://localhost:5557/management/session', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setManager(data);
        } else {
          router.push('/management/login');
        }
      } catch (err) {
        console.error(err);
        router.push('/management/login');
      }
    };

    fetchManager();
  }, [router]);

  const handleLogout = async () => {
    await fetch('http://localhost:5557/management/logout', {
      method: 'DELETE',
      credentials: 'include',
    });
    router.push('/management/login');
  };

  if (!manager) return <div className="text-center py-20 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {manager.name}</h1>
          <button
            onClick={handleLogout}
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Events" onClick={() => router.push('/management/events')} />
          <DashboardCard title="Ticket Types" onClick={() => router.push('/management/tickets')} />
          <DashboardCard title="Orders" onClick={() => router.push('/management/orders')} />
          {/* Optional: */}
          {/* <DashboardCard title="Users" onClick={() => router.push('/management/users')} /> */}
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-500">Manage {title.toLowerCase()} in the system.</p>
    </div>
  );
}
