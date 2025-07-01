import Link from 'next/link';

export default function CategoryCard({ name, count }) {
  return (
    <Link
      href={`/events?category=${name.toLowerCase()}`}
      className="border rounded-lg p-6 text-center hover:bg-gray-50 transition-colors duration-300"
    >
      <h3 className="font-bold text-lg mb-1">{name}</h3>
      <p className="text-gray-600">{count} events</p>
    </Link>
  );
}