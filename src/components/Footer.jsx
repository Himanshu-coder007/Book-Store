import { motion } from 'framer-motion'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { FiMail } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-pink-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">BookVerse</h3>
            <p className="text-pink-200">
              Discover your next favorite read with our curated collection of books across all genres.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-pink-200 hover:text-white transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-pink-200 hover:text-white transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-pink-200 hover:text-white transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-pink-200 hover:text-white transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-pink-200 hover:text-white transition-colors">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Books</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Categories</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Reviews</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Fiction</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Science</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Biography</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">History</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-colors">Fantasy</a></li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">Newsletter</h3>
            <p className="text-pink-200">
              Subscribe to our newsletter for the latest book releases and updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-lg focus:outline-none text-gray-800"
                required
              />
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-r-lg transition-colors flex items-center"
              >
                <FiMail className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-pink-700 mt-8 pt-6 text-center text-pink-200"
        >
          <p>&copy; {currentYear} BookVerse. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer