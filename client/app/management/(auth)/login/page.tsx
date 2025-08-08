'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

interface LoginResponse {
  token: string;
  manager: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export default function ManagementLoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post<LoginResponse>(
        'https://servertikiti-production.up.railway.app/management/login',
        { email, password }
      );

      if (data.token) {
        localStorage.setItem('managementToken', data.token);
        router.push('/management/dashboard');
      }
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      setError(error.response?.data?.error || 'Login failed');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Branding */}
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

      {/* Right: Form */}
      <div className="bg-white flex justify-center items-center p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-teal-800 underline mb-4 underline-offset-8">Admin Login</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="block text-sm mb-1 text-teal-800">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-teal-800">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="w-full btn btn-outline border text-lg border-teal-600 text-teal-600 py-2 rounded hover:bg-teal-600 hover:text-white transition"
          >
            Log In
          </button>
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <a href="/management/register" className="text-teal-600 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}