import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="EventHub Logo"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold">EventHub</span>
        </Link>
        
        <nav className="hidden md:flex gap-6">
          <Link href="/events" className="hover:text-blue-600">Events</Link>
          <Link href="/organizers" className="hover:text-blue-600">Organizers</Link>
          <Link href="/venues" className="hover:text-blue-600">Venues</Link>
        </nav>
        
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 hover:text-blue-600">Login</Link>
          <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}