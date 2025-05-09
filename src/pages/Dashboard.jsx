import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { FaHeart, FaRegHeart, FaShoppingCart, FaSpinner } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { toggleLike } from '../features/likes/likesSlice'
import { toggleCart } from '../features/cart/cartSlice'
import { setBooks, setLoading, setError } from '../features/books/booksSlice'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const dispatch = useDispatch()
  
  const { books, loading, error } = useSelector((state) => state.books)
  const { likedBooks } = useSelector((state) => state.likes)
  const { cartItems } = useSelector((state) => state.cart)

  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

  const fetchBooks = async (query = '') => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    try {
      const url = query 
        ? `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=20`
        : `https://www.googleapis.com/books/v1/volumes?q=subject:books&key=${API_KEY}&maxResults=20`
      
      const response = await axios.get(url)
      dispatch(setBooks(response.data.items || []))
    } catch (err) {
      dispatch(setError('Failed to fetch books. Please try again.'))
      console.error('Error fetching books:', err)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchBooks(searchQuery.trim())
  }

  const handleToggleLike = (bookId) => {
    dispatch(toggleLike(bookId))
  }

  const handleToggleCart = (bookId) => {
    dispatch(toggleCart(bookId))
  }

  return (
    <div className="min-h-screen">
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleSearch={handleSearch} 
        loading={loading} 
      />
      
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-16 w-16 border-t-4 border-b-4 border-blue-600 rounded-full"
            ></motion.div>
          </div>
        )}

        {/* Books Grid */}
        {!loading && books.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {books.map((book) => (
              <motion.div
                key={book.id}
                whileHover={{ y: -5 }}
                className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <Link to={`/book/${book.id}`} className="flex-1 flex flex-col">
                  {/* Book Cover */}
                  <div className="h-60 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    {book.volumeInfo.imageLinks?.thumbnail ? (
                      <img
                        src={book.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')}
                        alt={book.volumeInfo.title}
                        className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-gray-500">No image available</span>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleToggleLike(book.id)
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                        aria-label={likedBooks.includes(book.id) ? "Unlike" : "Like"}
                      >
                        {likedBooks.includes(book.id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className="text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleToggleCart(book.id)
                        }}
                        className={`p-2 bg-white rounded-full shadow-md transition-colors ${
                          cartItems.includes(book.id) 
                            ? 'text-green-500' 
                            : 'text-gray-600 hover:bg-blue-50'
                        }`}
                        aria-label={cartItems.includes(book.id) ? "In cart" : "Add to cart"}
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                  
                  {/* Book Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h2 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 min-h-[3.5rem]">
                      {book.volumeInfo.title}
                    </h2>
                    
                    {/* Hidden Details (shown on hover) */}
                    <div className="flex-1 max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500">
                      {book.volumeInfo.authors?.length > 0 && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">By:</span> {book.volumeInfo.authors.join(', ')}
                        </p>
                      )}
                      
                      {book.volumeInfo.publishedDate && (
                        <p className="text-xs text-gray-500 mb-2">
                          <span className="font-semibold">Published:</span> {new Date(book.volumeInfo.publishedDate).toLocaleDateString()}
                        </p>
                      )}
                      
                      {book.volumeInfo.description && (
                        <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                          {book.volumeInfo.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Always visible footer */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                      <span className="text-sm font-medium text-blue-600">
                        {book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : 'N/A'}
                      </span>
                      <span className="text-sm font-medium text-purple-600">
                        Details
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!loading && books.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block p-6 bg-white rounded-xl shadow-sm mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No books found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try searching for something else or check your spelling.
            </p>
            <button
              onClick={() => fetchBooks()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show Popular Books
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard