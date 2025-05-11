// components/HeroSlider.jsx
import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

// Memoized fallback data
const FALLBACK_BIOGRAPHIES = useMemo(() => [
  {
    id: 'fallback1',
    volumeInfo: {
      title: "The Story of My Experiments with Truth",
      authors: ["Mahatma Gandhi"],
      description: "The autobiography of Mohandas Karamchand Gandhi, covering his life from early childhood through to 1921. This profound work details Gandhi's spiritual journey and his development of the concept of Satyagraha (nonviolent resistance).",
      imageLinks: {
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/My_Experiments_With_Truth.jpg/1200px-My_Experiments_With_Truth.jpg"
      },
      publishedDate: "1927",
      infoLink: "https://en.wikipedia.org/wiki/The_Story_of_My_Experiments_with_Truth",
      previewLink: "https://www.gutenberg.org/ebooks/14681"
    }
  },
  {
    id: 'fallback2',
    volumeInfo: {
      title: "Wings of Fire",
      authors: ["A.P.J. Abdul Kalam"],
      description: "An autobiography of A.P.J. Abdul Kalam, former President of India, covering his early life and career in science. The book inspires with its story of a boy from a small town who rose to become the 'Missile Man of India' and later the President.",
      imageLinks: {
        thumbnail: "https://upload.wikimedia.org/wikipedia/en/7/7e/Wings_of_Fire_by_A_P_J_Abdul_Kalam_Book_Cover.jpg"
      },
      publishedDate: "1999",
      infoLink: "https://en.wikipedia.org/wiki/Wings_of_Fire_(autobiography)",
      previewLink: "https://books.google.com/books/about/Wings_of_Fire.html"
    }
  },
  {
    id: 'fallback3',
    volumeInfo: {
      title: "An Autobiography",
      authors: ["Jawaharlal Nehru"],
      description: "The autobiography of Jawaharlal Nehru, the first Prime Minister of independent India. Written during his imprisonment in the 1930s, it provides insight into the Indian freedom struggle and Nehru's vision for a modern India.",
      imageLinks: {
        thumbnail: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/An_Autobiography_%28Nehru%29.jpg/220px-An_Autobiography_%28Nehru%29.jpg"
      },
      publishedDate: "1936",
      infoLink: "https://en.wikipedia.org/wiki/An_Autobiography_(Nehru)",
      previewLink: "https://books.google.com/books/about/An_Autobiography.html"
    }
  }
].map(book => ({
  ...book,
  volumeInfo: {
    ...book.volumeInfo,
    thumbnail: book.volumeInfo.imageLinks.thumbnail
  }
})), [])

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [biographies, setBiographies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

  // Memoized fetch function
  const fetchBiographies = useCallback(async () => {
    try {
      setLoading(true)
      const queries = [
        'intitle:"autobiography of mahatma gandhi"',
        'intitle:"wings of fire abdul kalam"',
        'intitle:"nehru autobiography"',
        'intitle:"bhagat singh biography"',
        'intitle:"sardar patel biography"'
      ]
      
      // Using Promise.all for parallel requests with delay
      const results = await Promise.all(
        queries.map((query, index) => 
          new Promise(resolve => 
            setTimeout(async () => {
              try {
                const response = await axios.get(
                  `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=1`
                )
                resolve(response)
              } catch (err) {
                console.error(`Error fetching query "${query}":`, err)
                resolve({ data: { items: [] } })
              }
            }, index * 1000) // Stagger requests by 1 second
          )
        )
      )
      
      const validBiographies = results
        .map(res => res.data.items?.[0])
        .filter(book => book && book.volumeInfo?.imageLinks?.thumbnail)
        .map(book => ({
          ...book,
          volumeInfo: {
            ...book.volumeInfo,
            thumbnail: book.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')
          }
        }))
        
      if (validBiographies.length > 0) {
        setBiographies(validBiographies)
      } else {
        setBiographies(FALLBACK_BIOGRAPHIES)
        setError('Using fallback data as API requests were limited')
      }
    } catch (err) {
      console.error('Error fetching biographies:', err)
      setBiographies(FALLBACK_BIOGRAPHIES)
      setError('Failed to fetch from API. Using fallback data instead.')
    } finally {
      setLoading(false)
    }
  }, [API_KEY])

  useEffect(() => {
    // Only fetch if we haven't loaded anything yet
    if (biographies.length === 0) {
      fetchBiographies()
    }
  }, [fetchBiographies, biographies.length])

  // Memoized slide navigation functions
  const goToNextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev === biographies.length - 1 ? 0 : prev + 1))
  }, [biographies.length])

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev === 0 ? biographies.length - 1 : prev - 1))
  }, [biographies.length])

  // Auto-rotation effect
  useEffect(() => {
    if (biographies.length > 1) { // Only auto-rotate if we have multiple slides
      const interval = setInterval(goToNextSlide, 5000)
      return () => clearInterval(interval)
    }
  }, [biographies.length, goToNextSlide])

  // Memoized loading state UI
  const loadingUI = useMemo(() => (
    <div className="h-[32rem] md:h-[40rem] flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 rounded-xl mb-8 shadow-lg">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-t-4 border-b-4 border-amber-300 rounded-full mx-auto"
        />
        <p className="mt-4 text-amber-100 text-lg font-medium">Loading revolutionary stories...</p>
      </div>
    </div>
  ), [])

  // Memoized error state UI
  const errorUI = useMemo(() => (
    <div className="h-[32rem] bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 rounded-xl mb-8 flex flex-col items-center justify-center text-center p-6 shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 className="text-2xl font-bold text-amber-100 mb-2">Oops!</h3>
      <p className="text-gray-200 max-w-md">We couldn't find any biographies at the moment.</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors font-medium shadow-md"
      >
        Try Again
      </button>
    </div>
  ), [])

  if (loading) return loadingUI
  if (biographies.length === 0) return errorUI

  return (
    <div className="relative h-[32rem] md:h-[40rem] w-full overflow-hidden rounded-xl shadow-2xl mb-8 group">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-amber-500/90 text-white px-4 py-2 rounded-lg z-10 text-sm font-medium shadow-lg">
          {error}
        </div>
      )}
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 opacity-90"></div>
      
      {biographies.map((bio, index) => (
        <motion.div
          key={bio.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentSlide ? 1 : 0,
            transition: { duration: 1 }
          }}
          className="absolute inset-0 flex items-center"
        >
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
            <div className="md:w-2/5 flex justify-center relative">
              <motion.img
                src={bio.volumeInfo.thumbnail}
                alt={bio.volumeInfo.title}
                className="h-72 md:h-96 rounded-lg shadow-2xl object-cover border-2 border-amber-400/30"
                whileHover={{ scale: 1.02 }}
                initial={{ scale: 0.9 }}
                animate={{ 
                  scale: 1,
                  transition: { delay: 0.2, duration: 0.5 }
                }}
                loading="lazy" // Add lazy loading
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
                className="text-xl md:text-2xl text-amber-300 mb-4 font-medium"
                initial={{ x: -50 }}
                animate={{ x: 0, transition: { delay: 0.1 } }}
              >
                by {bio.volumeInfo.authors?.join(', ') || 'Unknown Author'}
              </motion.p>
              <motion.div 
                className="text-gray-100 text-base md:text-lg max-w-2xl line-clamp-4 mb-6"
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
                    className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors font-medium shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.5 } }}
                    whileHover={{ y: -2 }}
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
                    className="inline-flex items-center px-6 py-3 bg-gray-700/80 hover:bg-gray-600/90 text-white rounded-lg transition-colors font-medium shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.6 } }}
                    whileHover={{ y: -2 }}
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

      {/* Navigation arrows - only show if multiple slides */}
      {biographies.length > 1 && (
        <>
          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Navigation dots - only show if multiple slides */}
      {biographies.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
          {biographies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-amber-400 w-6' : 'bg-gray-400/70 hover:bg-gray-300'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default HeroSlider