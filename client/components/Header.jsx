'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-amber-700 tracking-wide">
          TIKITI
        </Link>
      </div>
    </header>
  );
}
