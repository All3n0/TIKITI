'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post(
        `http://localhost:5557/auth/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );
      setMessage(response.data.message || 'Password reset successfully');
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Orange with Wavy Edge */}
      <div className="hidden lg:block w-[45%] bg-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center p-12 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">Set New Password</h1>
            <p className="text-xl opacity-95">Create a new password for your account.</p>
          </div>
        </div>
        
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

      {/* Right Panel - Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Reset Password</h2>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
          {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-gray-700">New Password</label>
              <input
                type="password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3.5 rounded-lg hover:bg-amber-700 transition-colors font-medium text-lg shadow hover:shadow-md"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}