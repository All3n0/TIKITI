import Image from 'next/image'
import Link from 'next/link'

export default function OrganizerCard({ organizer }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300 border border-[#FFE699] dark:border-gray-700">
      <div className="relative h-32 w-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#FFE699] dark:border-gray-600">
        <Image
          src={organizer.avatar}
          alt={organizer.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="text-xl font-bold text-[#664D00] dark:text-white mb-1">
        {organizer.name}
      </h3>
      <p className="text-[#997300] dark:text-[#D4AF37] mb-3">
        {organizer.specialty}
      </p>
      <div className="flex justify-center items-center mb-4">
        <div className="flex items-center text-[#D4AF37] mr-4">
          <span className="mr-1">★</span>
          <span>{organizer.rating}</span>
        </div>
        <div className="text-[#997300] dark:text-[#D4AF37]">
          {organizer.eventsCount} events
        </div>
      </div>
      <Link
        href={`/organizers/${organizer.id}`}
        className="inline-block bg-[#FFF2CC] hover:bg-[#FFE699] dark:bg-gray-700 dark:hover:bg-gray-600 text-[#997300] dark:text-[#D4AF37] font-medium py-2 px-6 rounded-full transition-colors"
      >
        View Profile
      </Link>
    </div>
  )
}