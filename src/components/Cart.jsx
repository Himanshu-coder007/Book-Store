import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowLeft, FaPlus, FaMinus, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { toggleCart } from '../features/cart/cartSlice';
import { fetchBookById } from '../utils/api';

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartBooks, setCartBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCartBooks = async () => {
      try {
        setLoading(true);
        const booksData = await Promise.all(
          cartItems.map(id => fetchBookById(id))
        );
        const filteredBooks = booksData.filter(book => book !== null);
        setCartBooks(filteredBooks);
        
        // Initialize quantities
        const initialQuantities = {};
        filteredBooks.forEach(book => {
          initialQuantities[book.id] = quantities[book.id] || 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching cart books:', error);
      } finally {
        setLoading(false);
      }
    };

    if (cartItems.length > 0) {
      fetchCartBooks();
    } else {
      setCartBooks([]);
      setQuantities({});
      setLoading(false);
    }
  }, [cartItems]);

  const handleRemoveFromCart = (bookId) => {
    dispatch(toggleCart(bookId));
    // Remove the quantity for the deleted book
    const newQuantities = {...quantities};
    delete newQuantities[bookId];
    setQuantities(newQuantities);
  };

  const handleQuantityChange = (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return;
    setQuantities(prev => ({
      ...prev,
      [bookId]: newQuantity
    }));
  };

  // Function to generate a random price between 5 and 50 for a book
  const getBookPrice = (bookId) => {
    // Use bookId as seed for consistent pricing
    const hash = bookId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 5 + (hash % 45); // Price between 5 and 50
  };

  // Filter books based on search term
  const filteredBooks = cartBooks.filter(book => {
    const titleMatch = book.volumeInfo.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch = book.volumeInfo.authors?.some(author => 
      author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return titleMatch || authorMatch;
  });

  // Calculate total price for filtered books
  const calculateFilteredTotal = () => {
    return filteredBooks.reduce((total, book) => {
      return total + (getBookPrice(book.id) * (quantities[book.id] || 1));
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="inline-block p-6"
          >
            <FaShoppingCart className="w-16 h-16 mx-auto text-green-500" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Loading your cart...</h3>
          <p className="text-gray-500">Please wait while we fetch your items</p>
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
                Your <span className="text-green-500">Shopping Cart</span>
              </h1>
              <p className="text-gray-400 mt-2">
                {cartBooks.length} {cartBooks.length === 1 ? 'item' : 'items'} in cart
              </p>
            </motion.div>
          </div>

          {cartBooks.length > 0 && (
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search in cart..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {cartBooks.length > 0 ? (
          <>
            <AnimatePresence>
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {filteredBooks.map((book) => (
                    <motion.div
                      key={book.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                      className="group relative bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row border border-gray-800 hover:border-gray-700"
                    >
                      <Link to={`/book/${book.id}`} className="block md:w-1/4">
                        <div className="h-48 md:h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
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
                      </Link>
                      
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <Link to={`/book/${book.id}`}>
                            <h2 className="font-bold text-lg mb-1 text-white hover:text-green-400 transition-colors">
                              {book.volumeInfo.title}
                            </h2>
                          </Link>
                          {book.volumeInfo.authors?.length > 0 && (
                            <p className="text-sm text-gray-400 mb-2">
                              <span className="font-semibold">By:</span> {book.volumeInfo.authors.join(', ')}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-gray-800 mt-3">
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-bold text-green-400">
                              ${getBookPrice(book.id).toFixed(2)}
                            </span>
                            
                            <div className="flex items-center border border-gray-700 rounded-lg bg-gray-800">
                              <button
                                onClick={() => handleQuantityChange(book.id, (quantities[book.id] || 1) - 1)}
                                className="px-2 py-1 text-gray-400 hover:bg-gray-700 disabled:opacity-30"
                                disabled={(quantities[book.id] || 1) <= 1}
                              >
                                <FaMinus size={12} />
                              </button>
                              <span className="px-3 py-1 text-white">
                                {quantities[book.id] || 1}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(book.id, (quantities[book.id] || 1) + 1)}
                                className="px-2 py-1 text-gray-400 hover:bg-gray-700 disabled:opacity-30"
                                disabled={(quantities[book.id] || 1) >= 10}
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>
                            
                            <span className="text-sm font-medium text-gray-300">
                              ${(getBookPrice(book.id) * (quantities[book.id] || 1)).toFixed(2)}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveFromCart(book.id)}
                            className="p-2 text-red-500 hover:bg-red-900/30 rounded-full transition-colors"
                            aria-label="Remove from cart"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="bg-gray-900 rounded-xl shadow-lg p-6 mt-6 border border-gray-800"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold text-gray-300">
                          Total Items: {filteredBooks.reduce((acc, book) => acc + (quantities[book.id] || 1), 0)}
                        </h3>
                        <h3 className="text-xl font-bold text-green-400 mt-2">
                          Total Price: ${calculateFilteredTotal().toFixed(2)}
                        </h3>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg"
                      >
                        Proceed to Checkout
                      </motion.button>
                    </div>
                  </motion.div>
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
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No matching items found</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    No items in your cart match your search. Try a different term.
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
              <FaShoppingCart className="w-16 h-16 mx-auto text-green-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Looks like you haven't added any books to your cart yet. Start shopping now!
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 inline-flex items-center shadow-lg"
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

export default Cart;