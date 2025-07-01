'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useDarkMode } from '@/context/DarkModeContext'

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode() // Changed from setDarkMode to toggleDarkMode
  const [language, setLanguage] = useState('en')

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 relative">
            <Image
              src="/logo.png"
              alt="EventHub Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-bold text-[#D4AF37]">EventHub</span>
        </Link>

        {/* Navigation Links - Hidden on mobile */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/events" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] font-medium">
            Events
          </Link>
          <Link href="/organizers" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] font-medium">
            Organizers
          </Link>
          <Link href="/venues" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] font-medium">
            Venues
          </Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] font-medium">
            About
          </Link>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-md py-1 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="es">ES</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Mobile Menu Button - Hidden on desktop */}
          <button className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}