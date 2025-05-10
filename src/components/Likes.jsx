import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBookById } from '../utils/api';
import { toggleLike } from '../features/likes/likesSlice';

const Likes = () => {
  const { likedBooks } = useSelector((state) => state.likes);
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

  const filteredBooks = likedBooksData.filter(book => {
    const titleMatch = book.volumeInfo.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch = book.volumeInfo.authors?.some(author => 
      author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return titleMatch || authorMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block p-6"
          >
            <FaHeart className="w-16 h-16 mx-auto text-red-500" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Loading your favorites...</h3>
          <p className="text-gray-500">Please wait while we fetch your liked books</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-300 hover:text-white mb-4 transition-colors group"
            >
              <FaArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Your <span className="text-red-500">Favorites</span>
              </h1>
              <p className="text-gray-400 mt-2">
                {likedBooksData.length} {likedBooksData.length === 1 ? 'book' : 'books'} saved
              </p>
            </motion.div>
          </div>

          {likedBooksData.length > 0 && (
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search favorites..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  {filteredBooks.map((book) => (
                    <motion.div
                      key={book.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                      className="group relative bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-800 hover:border-gray-700"
                    >
                      <Link 
                        to={`/book/${book.id}`} 
                        className="flex-1 flex flex-col"
                      >
                        <div className="h-60 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                          {book.volumeInfo.imageLinks?.thumbnail ? (
                            <motion.img
                              src={book.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')}
                              alt={book.volumeInfo.title}
                              className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
                              whileHover={{ scale: 1.05 }}
                            />
                          ) : (
                            <span className="text-gray-500">No image available</span>
                          )}
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col">
                          <h2 className="font-bold text-lg mb-2 line-clamp-2 text-white min-h-[3.5rem]">
                            {book.volumeInfo.title}
                          </h2>
                          {book.volumeInfo.authors && (
                            <p className="text-sm text-gray-400 line-clamp-1 mb-3">
                              By {book.volumeInfo.authors.join(', ')}
                            </p>
                          )}
                          <div className="flex justify-between items-center pt-3 border-t border-gray-800 mt-auto">
                            <span className="text-sm font-medium text-blue-400">
                              {book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : 'N/A'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleRemoveLike(book.id);
                              }}
                              className="p-2 text-red-500 hover:bg-red-900/30 rounded-full transition-colors"
                              aria-label="Remove from favorites"
                            >
                              <FaHeart className="text-red-500" />
                            </button>
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
                  <div className="inline-block p-6 bg-gray-900 rounded-xl shadow-sm mb-4 border border-gray-800">
                    <FaSearch className="w-16 h-16 mx-auto text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No matching books found</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    No favorites match your search. Try a different term.
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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
            <div className="inline-block p-6 bg-gray-900 rounded-xl shadow-sm mb-4 border border-gray-800">
              <FaRegHeart className="w-16 h-16 mx-auto text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Your favorites list is empty</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven't liked any books yet. Start exploring and add some to your favorites!
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 inline-flex items-center"
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