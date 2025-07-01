'use client'
import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Thank you for subscribing with ${email}`)
    setEmail('')
  }

  return (
    <section className="bg-gold-800 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
        <p className="text-gold-200 mb-8 text-xl">
          Subscribe to our newsletter and never miss the latest events and updates.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-gold-500 text-gold-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-white hover:bg-gold-100 text-gold-800 font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}