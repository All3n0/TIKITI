'use client';

import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-6">
      {/* Top section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left px-4">
        {/* Column 1: Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-2">TIKITI</h2>
          <p className="text-sm text-blue-100">
            Your premium destination for discovering and booking amazing events worldwide.
          </p>
        </div>

        {/* Column 2: Events */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Events</h3>
          <ul className="space-y-1 text-sm text-blue-100">
            <li><Link href="/events">Browse Events</Link></li>
            <li><Link href="/categories">Event Categories</Link></li>
            <li><Link href="/venues">Popular Venues</Link></li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Support</h3>
          <ul className="space-y-1 text-sm text-blue-100">
            <li><Link href="/help">Help Center</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Column 4: Connect */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Connect</h3>
          <div className="flex justify-center md:justify-start gap-4 mt-2">
            <Link href="#" className="hover:text-blue-300"><Facebook className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-blue-300"><Twitter className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-blue-300"><Instagram className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-blue-300"><Linkedin className="w-5 h-5" /></Link>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-10 border-t border-gray-400 pt-4 text-center text-sm text-blue-100">
        © 2025 TIKITI. All rights reserved.
      </div>
    </footer>
  );
}
