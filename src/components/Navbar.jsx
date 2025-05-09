import { Link } from 'react-router-dom'
import { FaHeart, FaShoppingCart, FaBook } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const Navbar = () => {
  const { likedBooks } = useSelector((state) => state.likes)
  const { cartItems } = useSelector((state) => state.cart)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center text-xl font-bold text-gray-800"
            >
              <FaBook className="mr-2 text-blue-600" />
              BookStore
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/likes" 
              className="relative p-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <FaHeart className="h-5 w-5" />
              {likedBooks.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {likedBooks.length}
                </motion.span>
              )}
            </Link>
            
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <FaShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;