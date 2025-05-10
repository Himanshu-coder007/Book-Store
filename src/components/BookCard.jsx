import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLike } from '../features/likes/likesSlice';
import { toggleCart } from '../features/cart/cartSlice';

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const { likedBooks } = useSelector((state) => state.likes);
  const { cartItems } = useSelector((state) => state.cart);

  const handleToggleLike = (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleLike(bookId));
  };

  const handleToggleCart = (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleCart(bookId));
  };

  const publishedYear = book.volumeInfo.publishedDate 
    ? new Date(book.volumeInfo.publishedDate).getFullYear()
    : null;

  // Calculate average rating if available
  const averageRating = book.volumeInfo.averageRating || 0;
  const ratingsCount = book.volumeInfo.ratingsCount || 0;

  // Generate gradient color based on book title (consistent but randomish)
  const titleHash = book.volumeInfo.title.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const gradientColors = [
    ['#6366f1', '#8b5cf6'], // indigo to purple
    ['#10b981', '#06b6d4'], // emerald to cyan
    ['#f59e0b', '#ef4444'], // amber to red
    ['#8b5cf6', '#ec4899'], // purple to pink
    ['#06b6d4', '#3b82f6'], // cyan to blue
  ];
  const gradient = gradientColors[Math.abs(titleHash) % gradientColors.length];

  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;

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

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
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
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover';
                  e.target.className = 'w-full h-full object-contain p-4 bg-gray-800/50';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800/50">
                <span className="text-gray-400 text-sm">No cover available</span>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={(e) => handleToggleLike(e, book.id)}
                className={`p-2 rounded-full shadow-lg transition-all ${
                  likedBooks.includes(book.id)
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-900/80 text-gray-200 hover:bg-pink-600/80'
                }`}
                aria-label={likedBooks.includes(book.id) ? "Unlike" : "Like"}
              >
                {likedBooks.includes(book.id) ? (
                  <FaHeart className="text-current" />
                ) : (
                  <FaRegHeart className="text-current" />
                )}
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
                  {renderStars()}
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
};

export default BookCard;