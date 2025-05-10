import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHeart, FaShoppingCart, FaBook, FaSearch, FaSpinner, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  loading,
  suggestions,
  showSuggestions,
  suggestionsLoading,
  handleSuggestionClick,
  setShowSuggestions
}) => {
  const { likedBooks } = useSelector((state) => state.likes)
  const { cartItems } = useSelector((state) => state.cart)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchRef, setShowSuggestions])

  return (
    <nav className="bg-black shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center text-xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              <FaBook className="mr-2 text-blue-400" />
              BookStore
            </Link>
          </div>
          
          {/* Search Form */}
          <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value.trim()) {
                    setShowSuggestions(true)
                  }
                }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search for books..."
                className="flex-1 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300 w-full bg-gray-800 text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
                disabled={loading}
              >
                <FaSearch />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-20 mt-1 w-full bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-80 overflow-y-auto"
                >
                  {suggestionsLoading ? (
                    <div className="p-4 flex justify-center">
                      <FaSpinner className="animate-spin text-blue-400" />
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul>
                      {suggestions.map((suggestion) => (
                        <li 
                          key={suggestion.id}
                          className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center">
                            {suggestion.volumeInfo.imageLinks?.thumbnail && (
                              <img 
                                src={suggestion.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')}
                                alt={suggestion.volumeInfo.title}
                                className="w-10 h-14 object-contain mr-3"
                              />
                            )}
                            <div>
                              <p className="font-medium text-white line-clamp-1">
                                {suggestion.volumeInfo.title}
                              </p>
                              {suggestion.volumeInfo.authors && (
                                <p className="text-xs text-gray-400 line-clamp-1">
                                  {suggestion.volumeInfo.authors.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-gray-400 text-center">
                      No suggestions found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="flex items-center text-gray-300">
                  <FaUser className="mr-1" /> {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 text-gray-300 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="px-3 py-1 text-blue-400 hover:text-blue-300 transition-colors"
              >
                Login
              </Link>
            )}
            
            <Link 
              to="/likes" 
              className="relative p-2 text-gray-300 hover:text-red-400 transition-colors"
              title="Favorites"
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
              className="relative p-2 text-gray-300 hover:text-green-400 transition-colors"
              title="Cart"
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

export default Navbar