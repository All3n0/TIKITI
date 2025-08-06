'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagementRegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://servertikiti-production.up.railway.app/management/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/management/dashboard');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left section */}
      <div className="bg-teal-600 text-white flex flex-col justify-center items-center p-10 relative">
  <h1 className="text-4xl font-bold mb-4">Event Manager</h1>
  <p className="text-lg text-center">Admin panel to manage events, tickets, and users.</p>

  {/* Wavy Edge */}
  <div className="absolute right-0 top-0 bottom-0 w-24">
    <svg 
      viewBox="0 0 100 1000" 
      preserveAspectRatio="none"
      className="h-full w-full"
    >
      <path 
        d="M0,0 
           C20,25 20,75 0,100
           C20,125 20,175 0,200
           C20,225 20,275 0,300
           C20,325 20,375 0,400
           C20,425 20,475 0,500
           C20,525 20,575 0,600
           C20,625 20,675 0,700
           C20,725 20,775 0,800
           C20,825 20,875 0,900
           C20,925 20,975 0,1000
           L0,1000 L100,1000 L100,0 Z" 
        fill="white"
      />
    </svg>
  </div>
</div>


      {/* Right section */}
      <div className="bg-white flex justify-center items-center p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-teal-800 underline mb-4 underline-offset-4">Register</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="block text-sm mb-1 text-teal-600">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-teal-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-teal-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="w-full btn btn-outline border border-teal-600 text-teal-600 text-lg py-2 rounded hover:bg-teal-600 hover:text-white transition"
          >
            Register
          </button>
          <p className="text-sm text-center text-gray-600">
  Already have an account?{' '}
  <a href="/management/login" className="text-teal-600 hover:underline">
    Log in
  </a>
</p>

        </form>
      </div>
    </div>
  );
}
