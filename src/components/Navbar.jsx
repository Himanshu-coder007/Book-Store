import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaBook, FaSearch, FaSpinner, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { likedBooks } = useSelector((state) => state.likes);
  const { cartItems } = useSelector((state) => state.cart);
  const searchRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowSuggestions]);

  return (
    <nav className="bg-pink-50 shadow-sm sticky top-0 z-10 border-b border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center text-xl font-bold text-pink-800 hover:text-pink-600 transition-colors"
            >
              <FaBook className="mr-2 text-pink-500" />
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
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    setShowSuggestions(true);
                  }
                }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search for books..."
                className="flex-1 px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm transition-all duration-300 w-full bg-white text-pink-900 placeholder-pink-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
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
                  className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg border border-pink-200 max-h-80 overflow-y-auto"
                >
                  {suggestionsLoading ? (
                    <div className="p-4 flex justify-center">
                      <FaSpinner className="animate-spin text-pink-500" />
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul>
                      {suggestions.map((suggestion) => (
                        <li 
                          key={suggestion.id}
                          className="px-4 py-3 hover:bg-pink-50 cursor-pointer border-b border-pink-100 last:border-b-0 transition-colors"
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
                              <p className="font-medium text-pink-900 line-clamp-1">
                                {suggestion.volumeInfo.title}
                              </p>
                              {suggestion.volumeInfo.authors && (
                                <p className="text-xs text-pink-600 line-clamp-1">
                                  {suggestion.volumeInfo.authors.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-pink-600 text-center">
                      No suggestions found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/likes" 
              className="relative p-2 text-pink-700 hover:text-pink-500 transition-colors"
              title="Favorites"
            >
              <FaHeart className="h-5 w-5" />
              {likedBooks.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {likedBooks.length}
                </motion.span>
              )}
            </Link>
            
            <Link 
              to="/cart" 
              className="relative p-2 text-pink-700 hover:text-pink-500 transition-colors"
              title="Cart"
            >
              <FaShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </Link>

            {/* Simple User Icon */}
            <div className="p-2 text-pink-700" title="User">
              <FaUser className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;