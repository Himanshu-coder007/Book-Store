import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { setBooks, setLoading, setError } from '../features/books/booksSlice'
import Navbar from '../components/Navbar'
import BookCard from '../components/BookCard'
import HeroSlider from '../components/HeroSlider'
import ReviewsSection from '../components/ReviewsSection'
import Footer from '../components/Footer'
import { FiArrowRight } from 'react-icons/fi'

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const dispatch = useDispatch()
  const categoriesRef = useRef(null)
  
  const { books, loading, error } = useSelector((state) => state.books)
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

  const categories = [
    { id: 'all', name: 'All Books' },
    { id: 'fiction', name: 'Fiction' },
    { id: 'science', name: 'Science' },
    { id: 'biography', name: 'Biography' },
    { id: 'history', name: 'History' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'business', name: 'Business' },
  ]

  const fetchBooks = async (query = '', category = 'all') => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    setShowSuggestions(false)
    
    try {
      let url
      if (query) {
        url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=20`
      } else if (category !== 'all') {
        url = `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&key=${API_KEY}&maxResults=20`
      } else {
        url = `https://www.googleapis.com/books/v1/volumes?q=subject:books&key=${API_KEY}&maxResults=20`
      }
      
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
    fetchBooks('', selectedCategory)
  }, [selectedCategory])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchBooks(searchQuery.trim(), selectedCategory)
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.volumeInfo.title)
    fetchBooks(suggestion.volumeInfo.title, selectedCategory)
    setShowSuggestions(false)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSearchQuery('')
  }

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#fff5f7] text-gray-800 relative">
      {/* Navbar with higher z-index */}
      <div className="sticky top-0 z-50">
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
      </div>
      
      {/* Main content with lower z-index */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto relative z-10">
        {/* Hero Section with Image and Text - Increased height */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-8 my-8 md:my-12 min-h-[70vh]">
          <div className="md:w-1/2 space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-pink-800 leading-tight"
            >
              Find Yourself in a <span className="text-pink-600">Great Book</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600"
            >
              Discover your next favorite read from our extensive collection of books across all genres.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToCategories}
              className="flex items-center gap-2 px-8 py-4 bg-pink-600 text-white rounded-lg shadow-md hover:bg-pink-700 transition-all text-lg"
            >
              Get Started
              <FiArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2 flex justify-center h-full"
          >
            <img 
              src="/hero image.png" 
              alt="Person reading a book" 
              className="w-full max-w-lg rounded-lg shadow-xl object-contain h-full"
            />
          </motion.div>
        </section>

        {/* Hero Slider */}
        <HeroSlider />

        {/* Categories */}
        <div ref={categoriesRef} className="my-8">
          <h2 className="text-2xl font-bold mb-6 text-pink-800">Browse Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-pink-600 text-white'
                    : 'bg-pink-100 text-pink-800 hover:bg-pink-200'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 mb-6 bg-red-200 border border-red-400 text-red-800 rounded-lg shadow-sm"
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
              className="h-16 w-16 border-t-4 border-b-4 border-pink-500 rounded-full"
            ></motion.div>
          </div>
        )}

        {/* Books Grid */}
        {!loading && books.length > 0 && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-pink-800">
                {selectedCategory === 'all' 
                  ? 'Popular Books' 
                  : `${categories.find(c => c.id === selectedCategory)?.name} Books`}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </motion.div>

            {/* Reviews Section */}
            <ReviewsSection />
          </>
        )}

        {/* No Results */}
        {!loading && books.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block p-6 bg-pink-50 rounded-xl shadow-sm mb-4">
              <svg
                className="w-16 h-16 mx-auto text-pink-400"
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
            <h3 className="text-lg font-medium text-pink-800 mb-2">No books found</h3>
            <p className="text-pink-600 max-w-md mx-auto">
              Try searching for something else or check your spelling.
            </p>
            <button
              onClick={() => fetchBooks('', selectedCategory)}
              className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
            >
              Show {selectedCategory === 'all' ? 'Popular' : categories.find(c => c.id === selectedCategory)?.name} Books
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Dashboard