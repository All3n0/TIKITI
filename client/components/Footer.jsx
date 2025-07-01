export default function Footer() {
  return (
    <footer className="bg-gold-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">EventHub</h3>
            <p className="text-gold-200">
              Your premier destination for discovering and booking amazing events worldwide.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Events</h4>
            <ul className="space-y-2 text-gold-200">
              <li><a href="#" className="hover:text-white">Browse Events</a></li>
              <li><a href="#" className="hover:text-white">Create Event</a></li>
              <li><a href="#" className="hover:text-white">Event Categories</a></li>
              <li><a href="#" className="hover:text-white">Popular Venues</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-gold-200">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Connect</h4>
            <div className="flex gap-4 text-gold-200">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">Facebook</a>
              <a href="#" className="hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gold-700 pt-8 text-center text-gold-300">
          <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}