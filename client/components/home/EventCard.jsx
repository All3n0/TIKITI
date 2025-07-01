import Image from 'next/image'
import Link from 'next/link'

export default function EventCard({ event }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-[#FFE699] dark:border-gray-700">
      <div className="relative h-56 w-full">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4 bg-[#D4AF37] text-white text-sm font-medium px-3 py-1 rounded-full">
          {event.category}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[#997300] dark:text-[#D4AF37] font-medium">
            {event.date} • {event.time}
          </span>
          <div className="flex items-center text-[#D4AF37]">
            <span className="mr-1">★</span>
            <span>{event.rating}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-[#664D00] dark:text-white mb-2">
          {event.title}
        </h3>
        <p className="text-[#997300] dark:text-gray-300 mb-4 line-clamp-2">
          {event.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-[#997300] dark:text-[#D4AF37]">
            {event.location}
          </span>
          <Link
            href={`/events/${event.id}`}
            className="text-[#D4AF37] hover:text-[#997300] dark:hover:text-[#FFCC33] font-medium flex items-center"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}