'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('https://servertikiti-production.up.railway.app/auth/register', formData, {
        withCredentials: true,  // Important for cookies
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Check for successful registration
      if (response.data.message === 'Registered') {
        // Redirect to profile page
        router.push('/profile');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      // Handle different error cases
      if (err.response) {
        // Server responded with an error status
        setError(err.response.data.error || 'Registration failed');
      } else if (err.request) {
        // Request was made but no response received
        setError('Network error. Please check your connection.');
      } else {
        // Something else happened
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Orange with Wavy Edge */}
      <div className="hidden lg:block w-[45%] bg-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center p-12 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">Welcome to Tikiti!</h1>
            <p className="text-xl opacity-95">Your premium destination for discovering and booking amazing events worldwide.</p>
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
          <h2 className="text-3xl font-bold mb-8 text-amber-600 underline underline-offset-8">Create Account</h2>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-semibold text-amber-600">Username</label>
              <input
                type="text"
                required
                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-black"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-amber-600">Email</label>
              <input
                type="email"
                required
                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-black"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
  <label className="block mb-2 font-semibold text-amber-600">Password</label>
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      required
      className="w-full p-3 pr-10 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-black"
      value={formData.password}
      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3 top-3 text-gray-600 hover:text-amber-600"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  </div>
</div>

            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3.5 rounded-lg hover:bg-amber-700 transition-colors font-medium text-lg shadow hover:shadow-md"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}