'use client'
import { useState, useEffect } from 'react'
import EventCard from '@/components/home/EventCard'
import OrganizerCard from '@/components/home/OrganizerCard'
import CategorySection from '@/components/home/CategorySection'
import Newsletter from '../../../components/home/NewsLetter'

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [featuredOrganizers, setFeaturedOrganizers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const [categoriesRes, eventsRes, organizersRes] = await Promise.all([
          fetch('http://localhost:5557/api/event-categories'),
          fetch('http://localhost:5557/api/featured-events'),
          fetch('http://localhost:5557/api/featured-organizers')
        ])

        const [categoriesData, eventsData, organizersData] = await Promise.all([
          categoriesRes.json(),
          eventsRes.json(),
          organizersRes.json()
        ])

        setCategories(categoriesData)
        setFeaturedEvents(eventsData)
        setFeaturedOrganizers(organizersData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="animate-pulse text-[#D4AF37]">Loading...</div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-red-500">Error: {error}</div>
    </div>
  )

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#FFF9E6] to-white dark:from-gray-800 dark:to-gray-900 py-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-[#997300] dark:text-[#D4AF37] mb-6">
          Discover and Book Amazing Events
        </h1>
        <p className="text-xl text-[#997300] dark:text-[#D4AF37] mb-8 max-w-2xl mx-auto">
          Find local events, concerts, festivals, and more. Join millions of people experiencing the best events in your city.
        </p>
        <div className="flex justify-center gap-6">
          <a
            href="/events"
            className="bg-[#D4AF37] hover:bg-[#997300] text-white font-medium py-3 px-8 rounded-full shadow-md transition-all"
          >
            Explore Events
          </a>
          <a
            href="/create-event"
            className="border-2 border-[#D4AF37] text-[#997300] dark:text-[#D4AF37] hover:bg-[#FFF9E6] dark:hover:bg-gray-800 font-medium py-3 px-8 rounded-full transition-all"
          >
            Create Event
          </a>
        </div>
      </section>

      {/* Categories Section */}
      <CategorySection categories={categories} />

      {/* Featured Events */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#997300] dark:text-[#D4AF37] mb-12 text-center">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Featured Organizers */}
      <section className="py-16 px-4 max-w-7xl mx-auto bg-[#FFF9E6] dark:bg-gray-800 rounded-xl my-12">
        <h2 className="text-3xl font-bold text-[#997300] dark:text-[#D4AF37] mb-12 text-center">
          Featured Organizers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredOrganizers.map(organizer => (
            <OrganizerCard key={organizer.id} organizer={organizer} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  )
}