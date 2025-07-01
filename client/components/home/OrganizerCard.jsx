import Image from 'next/image'
import Link from 'next/link'

export default function OrganizerCard({ organizer }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300 border border-gold-100">
      <div className="relative h-32 w-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gold-200">
        <Image
          src={organizer.avatar}
          alt={organizer.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="text-xl font-bold text-gold-900 mb-1">{organizer.name}</h3>
      <p className="text-gold-600 mb-3">{organizer.specialty}</p>
      <div className="flex justify-center items-center mb-4">
        <div className="flex items-center text-gold-500 mr-4">
          <span className="mr-1">★</span>
          <span>{organizer.rating}</span>
        </div>
        <div className="text-gold-600">
          {organizer.eventsCount} events
        </div>
      </div>
      <Link
        href={`/organizers/${organizer.id}`}
        className="inline-block bg-gold-100 hover:bg-gold-200 text-gold-800 font-medium py-2 px-6 rounded-full transition-colors"
      >
        View Profile
      </Link>
    </div>
  )
}