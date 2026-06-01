import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img src="/logo.png" alt="My TravelLine" className="h-10 w-auto brightness-0 invert" />
            <p className="text-sm italic text-secondary-400">
              Creating Timeless Memories
            </p>
            <p className="text-sm leading-relaxed">
              Discover the world with curated travel experiences designed to create
              unforgettable moments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tours" className="hover:text-white transition-colors">Tours</Link></li>
              <li><Link to="/destinations" className="hover:text-white transition-colors">Destinations</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tour Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tours?category=adventure" className="hover:text-white transition-colors">Adventure</Link></li>
              <li><Link to="/tours?category=honeymoon" className="hover:text-white transition-colors">Honeymoon</Link></li>
              <li><Link to="/tours?category=family" className="hover:text-white transition-colors">Family</Link></li>
              <li><Link to="/tours?category=cultural" className="hover:text-white transition-colors">Cultural</Link></li>
              <li><Link to="/tours?category=wildlife" className="hover:text-white transition-colors">Wildlife</Link></li>
              <li><Link to="/tours?category=beach" className="hover:text-white transition-colors">Beach</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <HiLocationMarker className="h-5 w-5 text-primary-400 mt-0.5 shrink-0" />
                <span>123 Travel Street, Suite 100<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-2">
                <HiPhone className="h-5 w-5 text-primary-400 shrink-0" />
                <a href="tel:+11234567890" className="hover:text-white transition-colors">+1 (123) 456-7890</a>
              </li>
              <li className="flex items-center space-x-2">
                <HiMail className="h-5 w-5 text-primary-400 shrink-0" />
                <a href="mailto:info@mytravelline.com" className="hover:text-white transition-colors">info@mytravelline.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {currentYear} My TravelLine. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
