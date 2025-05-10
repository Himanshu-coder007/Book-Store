import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
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

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative group h-full"
    >
      <motion.div
        initial={false}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col border border-purple-800 overflow-hidden h-full"
      >
        <Link to={`/book/${book.id}`} className="flex-1 flex flex-col h-full">
          {/* Book Cover */}
          <div className="h-64 relative overflow-hidden">
            {book.volumeInfo.imageLinks?.thumbnail ? (
              <motion.img
                src={book.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')}
                alt={book.volumeInfo.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center">
                <span className="text-purple-300">No cover available</span>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={(e) => handleToggleLike(e, book.id)}
                className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                  likedBooks.includes(book.id)
                    ? 'bg-pink-500/90 text-white'
                    : 'bg-purple-900/80 text-purple-200 hover:bg-pink-500/20'
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
                className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                  cartItems.includes(book.id)
                    ? 'bg-purple-500/90 text-white'
                    : 'bg-purple-900/80 text-purple-200 hover:bg-purple-500/20'
                }`}
                aria-label={cartItems.includes(book.id) ? "In cart" : "Add to cart"}
              >
                <FaShoppingCart className="text-current" />
              </button>
            </div>
            
            {/* Year Badge */}
            {publishedYear && (
              <div className="absolute bottom-4 left-4 bg-purple-900/80 text-purple-100 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                {publishedYear}
              </div>
            )}
          </div>
          
          {/* Book Info */}
          <div className="p-5 flex-1 flex flex-col min-h-[180px]">
            <h2 className="font-bold text-xl mb-2 line-clamp-2 bg-gradient-to-r from-purple-200 to-purple-100 bg-clip-text text-transparent">
              {book.volumeInfo.title}
            </h2>
            
            <div className="min-h-[40px]">
              {book.volumeInfo.authors?.length > 0 ? (
                <p className="text-sm text-purple-200 mb-3 font-medium">
                  by {book.volumeInfo.authors.join(', ')}
                </p>
              ) : (
                <p className="text-sm text-transparent mb-3 font-medium">-</p>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-3">
              {book.volumeInfo.pageCount && (
                <span className="text-xs font-medium px-2 py-1 bg-purple-800/50 rounded-full text-purple-100">
                  {book.volumeInfo.pageCount} pages
                </span>
              )}
              <span className="text-sm font-medium text-purple-300 hover:underline flex items-center">
                Details <span className="ml-1">→</span>
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Popup Shadow Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0 }}
        whileHover={{ 
          opacity: 0.2,
          scale: 1.1,
          y: 20
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-purple-900 rounded-2xl -z-10"
      />
    </motion.div>
  );
};

export default BookCard;