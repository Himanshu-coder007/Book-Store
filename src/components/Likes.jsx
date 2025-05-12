import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaArrowLeft, FaSearch, FaShoppingCart, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBookById } from '../utils/api';
import { toggleLike } from '../features/likes/likesSlice';
import { toggleCart } from '../features/cart/cartSlice';

const Likes = () => {
  const { likedBooks } = useSelector((state) => state.likes);
  const { cartItems } = useSelector((state) => state.cart);
  const [likedBooksData, setLikedBooksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedBooks = async () => {
      try {
        setLoading(true);
        const booksData = await Promise.all(
          likedBooks.map(id => fetchBookById(id))
        );
        setLikedBooksData(booksData.filter(book => book !== null));
      } catch (error) {
        console.error('Error fetching liked books:', error);
      } finally {
        setLoading(false);
      }
    };

    if (likedBooks.length > 0) {
      fetchLikedBooks();
    } else {
      setLikedBooksData([]);
      setLoading(false);
    }
  }, [likedBooks]);

  const handleRemoveLike = (bookId) => {
    dispatch(toggleLike(bookId));
  };

  const handleToggleCart = (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleCart(bookId));
  };

  const filteredBooks = likedBooksData.filter(book => {
    const titleMatch = book.volumeInfo.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch = book.volumeInfo.authors?.some(author => 
      author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return titleMatch || authorMatch;
  });

  // Generate gradient color based on book title
  const getBookGradient = (title) => {
    const titleHash = title?.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const gradientColors = [
      ['#6366f1', '#8b5cf6'], // indigo to purple
      ['#10b981', '#06b6d4'], // emerald to cyan
      ['#f59e0b', '#ef4444'], // amber to red
      ['#8b5cf6', '#ec4899'], // purple to pink
      ['#06b6d4', '#3b82f6'], // cyan to blue
    ];
    return gradientColors[Math.abs(titleHash) % gradientColors.length];
  };

  // Generate stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm opacity-70" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300 text-sm opacity-40" />);
      }
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff5f7] p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block p-6"
          >
            <FaHeart className="w-16 h-16 mx-auto text-pink-600" />
          </motion.div>
          <h3 className="text-lg font-medium text-pink-800 mb-2">Loading your favorites...</h3>
          <p className="text-pink-600">Please wait while we fetch your liked books</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff5f7] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-pink-700 hover:text-pink-800 mb-4 transition-colors group"
            >
              <FaArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-pink-800">
                Your <span className="text-pink-600">Favorites</span>
              </h1>
              <p className="text-pink-600 mt-2">
                {likedBooksData.length} {likedBooksData.length === 1 ? 'book' : 'books'} saved
              </p>
            </motion.div>
          </div>

          {likedBooksData.length > 0 && (
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-pink-400" />
              </div>
              <input
                type="text"
                placeholder="Search favorites..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-pink-200 rounded-lg text-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {likedBooksData.length > 0 ? (
          <>
            <AnimatePresence>
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredBooks.map((book) => {
                    const gradient = getBookGradient(book.volumeInfo.title);
                    const publishedYear = book.volumeInfo.publishedDate 
                      ? new Date(book.volumeInfo.publishedDate).getFullYear()
                      : null;
                    const averageRating = book.volumeInfo.averageRating || 0;
                    const ratingsCount = book.volumeInfo.ratingsCount || 0;

                    return (
                      <motion.div
                        key={book.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -8 }}
                        className="relative group h-full"
                      >
                        <motion.div
                          initial={false}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.03 }}
                          transition={{ duration: 0.3 }}
                          className="relative z-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-700 overflow-hidden h-full"
                          style={{
                            background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
                          }}
                        >
                          <Link to={`/book/${book.id}`} className="flex-1 flex flex-col h-full">
                            {/* Book Cover */}
                            <div className="h-64 relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/70">
                              {book.volumeInfo.imageLinks?.thumbnail ? (
                                <motion.img
                                  src={book.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')}
                                  alt={book.volumeInfo.title}
                                  className="w-full h-full object-contain p-4"
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ duration: 0.5 }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800/50">
                                  <span className="text-gray-400 text-sm">No cover available</span>
                                </div>
                              )}
                              
                              {/* Action Buttons */}
                              <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRemoveLike(book.id);
                                  }}
                                  className="p-2 rounded-full shadow-lg bg-pink-600 text-white"
                                  aria-label="Remove from favorites"
                                >
                                  <FaHeart className="text-current" />
                                </button>
                                <button
                                  onClick={(e) => handleToggleCart(e, book.id)}
                                  className={`p-2 rounded-full shadow-lg transition-all ${
                                    cartItems.includes(book.id)
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-gray-900/80 text-gray-200 hover:bg-amber-500/80'
                                  }`}
                                  aria-label={cartItems.includes(book.id) ? "In cart" : "Add to cart"}
                                >
                                  <FaShoppingCart className="text-current" />
                                </button>
                              </div>
                              
                              {/* Year Badge */}
                              {publishedYear && (
                                <div className="absolute bottom-4 left-4 bg-gray-900/90 text-gray-100 text-xs px-2 py-1 rounded-full shadow-sm">
                                  {publishedYear}
                                </div>
                              )}
                            </div>
                            
                            {/* Book Info */}
                            <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-gray-900/30 to-gray-900/80">
                              <h2 className="font-bold text-lg mb-1 line-clamp-2 text-white">
                                {book.volumeInfo.title}
                              </h2>
                              
                              <div className="min-h-[40px]">
                                {book.volumeInfo.authors?.length > 0 ? (
                                  <p className="text-sm text-gray-300 mb-2">
                                    by {book.volumeInfo.authors.join(', ')}
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-400 mb-2">Author unknown</p>
                                )}
                              </div>
                              
                              {/* Rating */}
                              {averageRating > 0 && (
                                <div className="flex items-center mb-3">
                                  <div className="flex mr-2">
                                    {renderStars(averageRating)}
                                  </div>
                                  <span className="text-xs text-gray-300">
                                    ({ratingsCount})
                                  </span>
                                </div>
                              )}
                              
                              <div className="mt-auto pt-3 border-t border-gray-700 flex items-center justify-between">
                                {book.volumeInfo.pageCount && (
                                  <span className="text-xs font-medium px-2 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full text-gray-200">
                                    {book.volumeInfo.pageCount} pages
                                  </span>
                                )}
                                
                                <span className="text-sm font-medium text-white hover:underline flex items-center">
                                  View Details <span className="ml-1">→</span>
                                </span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>

                        {/* Floating effect */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 0 }}
                          whileHover={{ 
                            opacity: 0.2,
                            scale: 1.05,
                            y: 15
                          }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-white/10 rounded-xl -z-10 backdrop-blur-sm"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="inline-block p-6 bg-white rounded-xl shadow-sm mb-4 border border-pink-200">
                    <FaSearch className="w-16 h-16 mx-auto text-pink-400" />
                  </div>
                  <h3 className="text-lg font-medium text-pink-800 mb-2">No matching books found</h3>
                  <p className="text-pink-600 max-w-md mx-auto mb-6">
                    No favorites match your search. Try a different term.
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block p-6 bg-white rounded-xl shadow-sm mb-4 border border-pink-200">
              <FaRegHeart className="w-16 h-16 mx-auto text-pink-600" />
            </div>
            <h3 className="text-lg font-medium text-pink-800 mb-2">Your favorites list is empty</h3>
            <p className="text-pink-600 max-w-md mx-auto mb-6">
              You haven't liked any books yet. Start exploring and add some to your favorites!
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-lg hover:from-pink-700 hover:to-pink-600 transition-all duration-300 inline-flex items-center"
            >
              <FaSearch className="mr-2" />
              Browse Books
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Likes;