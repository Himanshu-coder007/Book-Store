import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { setBooks, setLoading, setError } from '../features/books/booksSlice'
import Navbar from '../components/Navbar'
import BookCard from '../components/BookCard'

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const dispatch = useDispatch()
  
  const { books, loading, error } = useSelector((state) => state.books)
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

  const fetchBooks = async (query = '') => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    setShowSuggestions(false)
    
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

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setSuggestionsLoading(true)
    
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=5`
      )
      setSuggestions(response.data.items || [])
      setShowSuggestions(true)
    } catch (err) {
      console.error('Error fetching suggestions:', err)
      setSuggestions([])
    } finally {
      setSuggestionsLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSuggestions(searchQuery)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchBooks(searchQuery.trim())
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.volumeInfo.title)
    fetchBooks(suggestion.volumeInfo.title)
    setShowSuggestions(false)
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleSearch={handleSearch} 
        loading={loading}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        suggestionsLoading={suggestionsLoading}
        handleSuggestionClick={handleSuggestionClick}
        setShowSuggestions={setShowSuggestions}
      />
      
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 mb-6 bg-red-900/80 border border-red-700 text-red-100 rounded-lg shadow-sm"
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
              className="h-16 w-16 border-t-4 border-b-4 border-blue-500 rounded-full"
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
              <BookCard key={book.id} book={book} />
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
            <div className="inline-block p-6 bg-gray-900 rounded-xl shadow-sm mb-4">
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
            <h3 className="text-lg font-medium text-gray-200 mb-2">No books found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Try searching for something else or check your spelling.
            </p>
            <button
              onClick={() => fetchBooks()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
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