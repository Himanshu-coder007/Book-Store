// pages/BookDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [inCart, setInCart] = useState(false);

  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`
        );
        setBook(response.data);
        
        // Check local storage for liked and cart status
        const likedBooks = JSON.parse(localStorage.getItem('likedBooks')) || [];
        setLiked(likedBooks.includes(id));
        
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setInCart(cartItems.includes(id));
      } catch (err) {
        setError('Failed to fetch book details. Please try again.');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const toggleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    
    // Update local storage
    const likedBooks = JSON.parse(localStorage.getItem('likedBooks')) || [];
    if (newLiked) {
      localStorage.setItem('likedBooks', JSON.stringify([...likedBooks, id]));
    } else {
      localStorage.setItem('likedBooks', JSON.stringify(likedBooks.filter(bookId => bookId !== id)));
    }
  };

  const toggleCart = () => {
    const newInCart = !inCart;
    setInCart(newInCart);
    
    // Update local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (newInCart) {
      localStorage.setItem('cartItems', JSON.stringify([...cartItems, id]));
    } else {
      localStorage.setItem('cartItems', JSON.stringify(cartItems.filter(bookId => bookId !== id)));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-t-4 border-b-4 border-blue-600 rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Book not found</h2>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Function to render star ratings
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors font-medium"
        >
          <FaArrowLeft className="mr-2" />
          Back to all books
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="md:flex">
            {/* Book Cover */}
            <div className="md:w-1/3 lg:w-1/4 p-8 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              {book.volumeInfo.imageLinks?.thumbnail ? (
                <motion.div
                  className="relative w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://').replace('zoom=1', 'zoom=2')}
                    alt={book.volumeInfo.title}
                    className="absolute inset-0 w-full h-full object-contain drop-shadow-lg"
                  />
                </motion.div>
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
                  <div className="text-gray-500 text-center p-6">
                    <div className="text-4xl mb-2">📖</div>
                    <p>No cover image available</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Book Details */}
            <div className="md:w-2/3 lg:w-3/4 p-8">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {book.volumeInfo.title}
                      </h1>
                      {book.volumeInfo.subtitle && (
                        <h2 className="text-xl md:text-2xl text-gray-600 mb-4">
                          {book.volumeInfo.subtitle}
                        </h2>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleLike}
                        className={`p-3 rounded-full transition-colors ${
                          liked ? 'bg-red-50' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        aria-label={liked ? "Unlike" : "Like"}
                      >
                        {liked ? (
                          <FaHeart className="text-red-500 text-xl" />
                        ) : (
                          <FaRegHeart className="text-gray-600 text-xl" />
                        )}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleCart}
                        className={`p-3 rounded-full transition-colors ${
                          inCart 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        aria-label={inCart ? "Remove from cart" : "Add to cart"}
                      >
                        <FaShoppingCart className="text-xl" />
                      </motion.button>
                    </div>
                  </div>
                  
                  {book.volumeInfo.authors?.length > 0 && (
                    <p className="text-lg text-gray-700 mb-4">
                      <span className="font-semibold">By:</span> {book.volumeInfo.authors.join(', ')}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    {book.volumeInfo.publishedDate && (
                      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                        Published: {new Date(book.volumeInfo.publishedDate).getFullYear()}
                      </div>
                    )}
                    
                    {book.volumeInfo.pageCount && (
                      <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                        {book.volumeInfo.pageCount} pages
                      </div>
                    )}
                    
                    {book.volumeInfo.averageRating && (
                      <div className="flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                        <div className="flex mr-1">
                          {renderRatingStars(book.volumeInfo.averageRating)}
                        </div>
                        {book.volumeInfo.averageRating.toFixed(1)} ({book.volumeInfo.ratingsCount || 0})
                      </div>
                    )}
                    
                    {book.volumeInfo.language && (
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                        {book.volumeInfo.language.toUpperCase()}
                      </div>
                    )}
                    
                    {book.volumeInfo.categories?.length > 0 && (
                      <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
                        {book.volumeInfo.categories[0]}
                      </div>
                    )}
                  </div>
                  
                  {book.volumeInfo.description && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
                      <div className="prose max-w-none text-gray-700">
                        <p className="whitespace-pre-line">
                          {book.volumeInfo.description}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {book.volumeInfo.publisher && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Publisher</h4>
                        <p className="text-gray-800 font-medium">{book.volumeInfo.publisher}</p>
                      </div>
                    )}
                    
                    {book.volumeInfo.industryIdentifiers?.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">ISBN</h4>
                        <div className="space-y-1">
                          {book.volumeInfo.industryIdentifiers.map((id, index) => (
                            <p key={index} className="text-gray-800 font-medium">
                              {id.type}: {id.identifier}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-auto pt-6 border-t border-gray-200">
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={book.volumeInfo.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    View on Google Books
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetails;