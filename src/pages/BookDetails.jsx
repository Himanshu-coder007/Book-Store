import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { toggleLike } from '../features/likes/likesSlice';
import { toggleCart } from '../features/cart/cartSlice';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  const { likedBooks } = useSelector((state) => state.likes);
  const { cartItems } = useSelector((state) => state.cart);
  
  const liked = likedBooks.includes(id);
  const inCart = cartItems.includes(id);

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
      } catch (err) {
        setError('Failed to fetch book details. Please try again.');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleToggleLike = () => {
    dispatch(toggleLike(id));
  };

  const handleToggleCart = () => {
    dispatch(toggleCart(id));
  };

  // Function to safely render HTML description
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html)
    };
  };

  // Function to render star ratings
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-pink-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-pink-500 opacity-50" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-t-4 border-b-4 border-pink-500 rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="max-w-md p-8 bg-white rounded-xl shadow-lg text-center border border-pink-200">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">{error}</h2>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-colors shadow-md"
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
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="max-w-md p-8 bg-white rounded-xl shadow-lg text-center border border-pink-200">
          <h2 className="text-2xl font-bold text-pink-800 mb-4">Book not found</h2>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-colors shadow-md"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-pink-600 hover:text-pink-500 mb-8 transition-colors font-medium"
        >
          <FaArrowLeft className="mr-2" />
          Back to all books
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-200"
        >
          <div className="md:flex">
            {/* Book Cover */}
            <div className="md:w-1/3 lg:w-1/4 p-8 flex items-center justify-center bg-pink-100">
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
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover';
                      e.target.className = 'absolute inset-0 w-full h-full object-contain bg-pink-200';
                    }}
                  />
                </motion.div>
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-pink-200 rounded-lg">
                  <div className="text-pink-600 text-center p-6">
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
                      <h1 className="text-3xl md:text-4xl font-bold text-pink-900 mb-2">
                        {book.volumeInfo.title}
                      </h1>
                      {book.volumeInfo.subtitle && (
                        <h2 className="text-xl md:text-2xl text-pink-700 mb-4">
                          {book.volumeInfo.subtitle}
                        </h2>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleToggleLike}
                        className={`p-3 rounded-full transition-colors ${
                          liked ? 'bg-pink-100 text-pink-600' : 'bg-pink-50 hover:bg-pink-100 text-pink-400'
                        }`}
                        aria-label={liked ? "Unlike" : "Like"}
                      >
                        {liked ? (
                          <FaHeart className="text-xl" />
                        ) : (
                          <FaRegHeart className="text-xl" />
                        )}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleToggleCart}
                        className={`p-3 rounded-full transition-colors ${
                          inCart 
                            ? 'bg-pink-100 text-pink-600' 
                            : 'bg-pink-50 hover:bg-pink-100 text-pink-400'
                        }`}
                        aria-label={inCart ? "Remove from cart" : "Add to cart"}
                      >
                        <FaShoppingCart className="text-xl" />
                      </motion.button>
                    </div>
                  </div>
                  
                  {book.volumeInfo.authors?.length > 0 && (
                    <p className="text-lg text-pink-700 mb-4">
                      <span className="font-semibold text-pink-600">By:</span> {book.volumeInfo.authors.join(', ')}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    {book.volumeInfo.publishedDate && (
                      <div className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium">
                        Published: {new Date(book.volumeInfo.publishedDate).getFullYear()}
                      </div>
                    )}
                    
                    {book.volumeInfo.pageCount && (
                      <div className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium">
                        {book.volumeInfo.pageCount} pages
                      </div>
                    )}
                    
                    {book.volumeInfo.averageRating && (
                      <div className="flex items-center bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium">
                        <div className="flex mr-1">
                          {renderRatingStars(book.volumeInfo.averageRating)}
                        </div>
                        {book.volumeInfo.averageRating.toFixed(1)} ({book.volumeInfo.ratingsCount || 0})
                      </div>
                    )}
                    
                    {book.volumeInfo.language && (
                      <div className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium">
                        {book.volumeInfo.language.toUpperCase()}
                      </div>
                    )}
                    
                    {book.volumeInfo.categories?.length > 0 && (
                      <div className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium">
                        {book.volumeInfo.categories[0]}
                      </div>
                    )}
                  </div>
                  
                  {book.volumeInfo.description && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-pink-800 mb-3">Description</h3>
                      <div className="prose max-w-none text-pink-900">
                        <div dangerouslySetInnerHTML={createMarkup(book.volumeInfo.description)} />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {book.volumeInfo.publisher && (
                      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <h4 className="text-sm font-semibold text-pink-600 mb-2">Publisher</h4>
                        <p className="text-pink-800 font-medium">{book.volumeInfo.publisher}</p>
                      </div>
                    )}
                    
                    {book.volumeInfo.industryIdentifiers?.length > 0 && (
                      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <h4 className="text-sm font-semibold text-pink-600 mb-2">ISBN</h4>
                        <div className="space-y-1">
                          {book.volumeInfo.industryIdentifiers.map((id, index) => (
                            <p key={index} className="text-pink-800 font-medium">
                              {id.type}: {id.identifier}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-auto pt-6 border-t border-pink-200">
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={book.volumeInfo.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-colors shadow-md font-medium"
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