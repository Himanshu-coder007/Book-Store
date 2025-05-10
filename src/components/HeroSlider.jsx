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
          'intitle:"nehru autobiography"'
        ]
        
        const results = await Promise.all(
          queries.map(query => 
            axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=1`)
          )
        )
        
        const validBiographies = results
          .map(res => res.data.items?.[0])
          .filter(book => book && book.volumeInfo.imageLinks?.thumbnail)
          
        setBiographies(validBiographies)
      } catch (err) {
        setError('Failed to fetch biographies')
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

  if (loading) {
    return (
      <div className="h-96 md:h-[32rem] flex items-center justify-center bg-gray-900 rounded-xl mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-t-4 border-b-4 border-blue-500 rounded-full"
        />
      </div>
    )
  }

  if (error || biographies.length === 0) {
    return (
      <div className="h-64 bg-gray-900 rounded-xl mb-8 flex items-center justify-center text-gray-400">
        {error || 'No biographies found'}
      </div>
    )
  }

  return (
    <div className="relative h-96 md:h-[32rem] w-full overflow-hidden rounded-xl shadow-lg mb-8">
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
            <div className="md:w-1/3 flex justify-center">
              <motion.img
                src={bio.volumeInfo.imageLinks?.thumbnail.replace('http://', 'https://')}
                alt={bio.volumeInfo.title}
                className="h-64 md:h-80 rounded-lg shadow-xl object-contain"
                whileHover={{ scale: 1.02 }}
              />
            </div>
            <div className="md:w-2/3 md:pl-12 mt-6 md:mt-0">
              <motion.h2 
                className="text-2xl md:text-4xl font-bold text-white mb-2"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
              >
                {bio.volumeInfo.title}
              </motion.h2>
              <motion.p 
                className="text-lg md:text-xl text-blue-300 mb-4"
                initial={{ x: -50 }}
                animate={{ x: 0, transition: { delay: 0.1 } }}
              >
                by {bio.volumeInfo.authors?.join(', ') || 'Unknown Author'}
              </motion.p>
              <motion.p 
                className="text-gray-200 text-sm md:text-base max-w-2xl line-clamp-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
              >
                {bio.volumeInfo.description || 'No description available'}
              </motion.p>
              {bio.volumeInfo.infoLink && (
                <motion.a
                  href={bio.volumeInfo.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.5 } }}
                >
                  View on Google Books
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {biographies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-gray-500'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider;