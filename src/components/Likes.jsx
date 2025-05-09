import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Likes = () => {
  const { likedBooks } = useSelector((state) => state.likes);
  const books = useSelector((state) => state.books.books);

  const likedBooksData = books.filter(book => likedBooks.includes(book.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
              Your Favorite Books
            </span>
          </h1>
          <p className="text-gray-600 mt-2">
            {likedBooksData.length} {likedBooksData.length === 1 ? 'book' : 'books'} saved
          </p>
        </motion.div>

        {likedBooksData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {likedBooksData.map((book) => (
              <motion.div
                key={book.id}
                whileHover={{ y: -5 }}
                className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/book/${book.id}`} className="block">
                  <div className="h-60 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    {book.volumeInfo.imageLinks?.thumbnail ? (
                      <img
                        src={book.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')}
                        alt={book.volumeInfo.title}
                        className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-gray-500">No image available</span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h2 className="font-bold text-lg mb-1 line-clamp-2 text-gray-800">
                      {book.volumeInfo.title}
                    </h2>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-3">
                      <span className="text-sm font-medium text-blue-600">
                        {book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : 'N/A'}
                      </span>
                      <FaHeart className="text-red-500" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block p-6 bg-white rounded-xl shadow-sm mb-4">
              <FaRegHeart className="w-16 h-16 mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No favorite books yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven't liked any books yet. Start exploring and add some to your favorites!
            </p>
            <Link
              to="/"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 inline-block"
            >
              Browse Books
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Likes;