'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import axios from 'axios';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get('http://localhost:5557/auth/session', {
          withCredentials: true
        });
        if (res.data?.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-amber-700 tracking-wide">
          TIKITI
        </Link>

        {/* User Icon */}
        <Link
          href={isLoggedIn ? '/profile' : '/register'}
          className="text-gray-700 hover:text-amber-600 transition-colors"
        >
          <User className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}
