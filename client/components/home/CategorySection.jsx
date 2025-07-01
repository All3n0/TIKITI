import Link from 'next/link'

export default function CategorySection({ categories }) {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gold-800 mb-12 text-center">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/events?category=${category.name.toLowerCase()}`}
            className="bg-white border border-gold-200 rounded-xl p-6 text-center hover:bg-gold-50 transition-colors shadow-sm hover:shadow-md"
          >
            <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gold-600 text-2xl">
                {getCategoryIcon(category.name)}
              </span>
            </div>
            <h3 className="font-bold text-lg text-gold-800 mb-1">{category.name}</h3>
            <p className="text-gold-600">{category.count} events</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

function getCategoryIcon(category) {
  switch(category.toLowerCase()) {
    case 'music':
      return '♫'
    case 'sports':
      return '⚽'
    case 'arts & theater':
      return '🎭'
    case 'festivals':
      return '🎪'
    default:
      return '🎉'
  }
}