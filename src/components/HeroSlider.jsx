// components/HeroSlider.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [biographies, setBiographies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

  useEffect(() => {
    const fetchBiographies = async () => {
      try {
        setLoading(true)
        const queries = [
          'intitle:"autobiography of mahatma gandhi"',
          'intitle:"subhas chandra bose autobiography"',
          'intitle:"bhagat singh biography"',
          'intitle:"wings of fire abdul kalam"',
          'intitle:"nehru autobiography"',
          'intitle:"sardar patel biography"',
          'intitle:"lal bahadur shastri biography"',
          'intitle:"rani lakshmibai biography"',
          'intitle:"tilak biography"',
          'intitle:"bipin chandra pal biography"',
          'intitle:"lala lajpat rai biography"',
          'intitle:"chandra shekhar azad biography"'
        ]
        
        const results = await Promise.all(
          queries.map(query => 
            axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=1`)
          )
        )
        
        const validBiographies = results
          .map(res => res.data.items?.[0])
          .filter(book => book && book.volumeInfo.imageLinks?.thumbnail)
          .map(book => ({
            ...book,
            volumeInfo: {
              ...book.volumeInfo,
              thumbnail: book.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')
            }
          }))
          
        setBiographies(validBiographies)
      } catch (err) {
        setError('Failed to fetch biographies. Please try again later.')
        console.error('Error fetching biographies:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBiographies()
  }, [API_KEY])

  useEffect(() => {
    if (biographies.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === biographies.length - 1 ? 0 : prev + 1))
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [biographies])

  const goToNextSlide = () => {
    setCurrentSlide(prev => (prev === biographies.length - 1 ? 0 : prev + 1))
  }

  const goToPrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? biographies.length - 1 : prev - 1))
  }

  if (loading) {
    return (
      <div className="h-[32rem] md:h-[40rem] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl mb-8">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-16 w-16 border-t-4 border-b-4 border-amber-500 rounded-full mx-auto"
          />
          <p className="mt-4 text-amber-100 text-lg">Loading revolutionary stories...</p>
        </div>
      </div>
    )
  }

  if (error || biographies.length === 0) {
    return (
      <div className="h-[32rem] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl mb-8 flex flex-col items-center justify-center text-center p-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-2xl font-bold text-amber-100 mb-2">Oops!</h3>
        <p className="text-gray-300 max-w-md">{error || 'We couldn\'t find any biographies at the moment.'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="relative h-[32rem] md:h-[40rem] w-full overflow-hidden rounded-xl shadow-2xl mb-8 group">
      {biographies.map((bio, index) => (
        <motion.div
          key={bio.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentSlide ? 1 : 0,
            transition: { duration: 1 }
          }}
          className="absolute inset-0 flex items-center bg-gradient-to-r from-black/90 via-black/70 to-black/30"
        >
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
            <div className="md:w-2/5 flex justify-center relative">
              <motion.img
                src={bio.volumeInfo.thumbnail}
                alt={bio.volumeInfo.title}
                className="h-72 md:h-96 rounded-lg shadow-2xl object-cover border-2 border-amber-500/30"
                whileHover={{ scale: 1.02 }}
                initial={{ scale: 0.9 }}
                animate={{ 
                  scale: 1,
                  transition: { delay: 0.2, duration: 0.5 }
                }}
              />
              <div className="absolute -bottom-4 -right-4 bg-amber-600 text-white px-3 py-1 rounded-lg shadow-lg text-sm font-medium">
                {bio.volumeInfo.publishedDate?.substring(0,4) || 'Year N/A'}
              </div>
            </div>
            <div className="md:w-3/5 md:pl-12 mt-8 md:mt-0">
              <motion.h2 
                className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
              >
                {bio.volumeInfo.title}
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl text-amber-300 mb-4"
                initial={{ x: -50 }}
                animate={{ x: 0, transition: { delay: 0.1 } }}
              >
                by {bio.volumeInfo.authors?.join(', ') || 'Unknown Author'}
              </motion.p>
              <motion.div 
                className="text-gray-200 text-base md:text-lg max-w-2xl line-clamp-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
              >
                {bio.volumeInfo.description || 'No description available'}
              </motion.div>
              <div className="flex flex-wrap gap-4">
                {bio.volumeInfo.infoLink && (
                  <motion.a
                    href={bio.volumeInfo.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.5 } }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    View Book
                  </motion.a>
                )}
                {bio.volumeInfo.previewLink && (
                  <motion.a
                    href={bio.volumeInfo.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.6 } }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
        {biographies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-amber-500 w-6' : 'bg-gray-500 hover:bg-gray-400'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider;