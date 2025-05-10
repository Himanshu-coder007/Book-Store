import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { toggleLike } from '../features/likes/likesSlice'
import { toggleCart } from '../features/cart/cartSlice'

const BookCard = ({ book }) => {
  const dispatch = useDispatch()
  const { likedBooks } = useSelector((state) => state.likes)
  const { cartItems } = useSelector((state) => state.cart)

  const handleToggleLike = (e, bookId) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleLike(bookId))
  }

  const handleToggleCart = (e, bookId) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleCart(bookId))
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-800"
    >
      <Link to={`/book/${book.id}`} className="flex-1 flex flex-col">
        {/* Book Cover */}
        <div className="h-60 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
          {book.volumeInfo.imageLinks?.thumbnail ? (
            <img
              src={book.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')}
              alt={book.volumeInfo.title}
              className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="text-gray-500">No image available</span>
          )}
          
          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => handleToggleLike(e, book.id)}
              className="p-2 bg-gray-800 rounded-full shadow-md hover:bg-red-900/50 transition-colors"
              aria-label={likedBooks.includes(book.id) ? "Unlike" : "Like"}
            >
              {likedBooks.includes(book.id) ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-400" />
              )}
            </button>
            <button
              onClick={(e) => handleToggleCart(e, book.id)}
              className={`p-2 bg-gray-800 rounded-full shadow-md transition-colors ${
                cartItems.includes(book.id) 
                  ? 'text-green-500' 
                  : 'text-gray-400 hover:bg-blue-900/50'
              }`}
              aria-label={cartItems.includes(book.id) ? "In cart" : "Add to cart"}
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
        
        {/* Book Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h2 className="font-bold text-lg mb-2 line-clamp-2 text-gray-100 min-h-[3.5rem]">
            {book.volumeInfo.title}
          </h2>
          
          {/* Hidden Details (shown on hover) */}
          <div className="flex-1 max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500">
            {book.volumeInfo.authors?.length > 0 && (
              <p className="text-sm text-gray-400 mb-2">
                <span className="font-semibold text-gray-300">By:</span> {book.volumeInfo.authors.join(', ')}
              </p>
            )}
            
            {book.volumeInfo.publishedDate && (
              <p className="text-xs text-gray-500 mb-2">
                <span className="font-semibold text-gray-400">Published:</span> {new Date(book.volumeInfo.publishedDate).toLocaleDateString()}
              </p>
            )}
            
            {book.volumeInfo.description && (
              <p className="text-xs text-gray-400 line-clamp-3 mb-3">
                {book.volumeInfo.description}
              </p>
            )}
          </div>
          
          {/* Always visible footer */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-800 mt-auto">
            <span className="text-sm font-medium text-blue-400">
              {book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : 'N/A'}
            </span>
            <span className="text-sm font-medium text-purple-400">
              Details
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default BookCard