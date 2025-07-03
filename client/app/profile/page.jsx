'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5557/auth/session', {
          withCredentials: true,
        });
        if (res.data?.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error('Error fetching user', err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5557/auth/logout', {}, {
        withCredentials: true,
      });
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        {/* Profile Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-6">
            {/* Left: User Icon */}
            <div className="bg-amber-100 p-4 rounded-full">
              <User className="w-12 h-12 text-amber-700" />
            </div>

            {/* Right: User Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Placeholder for Events/Tickets */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Events & Tickets</h3>
          <div className="text-gray-500 italic">
            This section will show events and tickets you've booked — coming soon!
          </div>
        </div>
      </div>
    </div>
  );
}