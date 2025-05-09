import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa';
import { motion } from 'framer-motion';
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

  // Calculate total price
  const calculateTotal = () => {
    return cartBooks.reduce((total, book) => {
      return total + (getBookPrice(book.id) * (quantities[book.id] || 1));
    }, 0);
  };

  // Function to strip HTML tags and truncate description
  const formatDescription = (html) => {
    if (!html) return '';
    // Strip HTML tags
    const plainText = html.replace(/<[^>]*>?/gm, '');
    // Truncate to 200 characters if needed
    return plainText.length > 200 ? `${plainText.substring(0, 200)}...` : plainText;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-6">
            <FaShoppingCart className="w-16 h-16 mx-auto text-gray-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Loading your cart...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
              Your Shopping Cart
            </span>
          </h1>
          <p className="text-gray-600 mt-2">
            {cartBooks.length} {cartBooks.length === 1 ? 'item' : 'items'} in cart
          </p>
        </motion.div>

        {cartBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {cartBooks.map((book) => (
              <motion.div
                key={book.id}
                whileHover={{ scale: 1.01 }}
                className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
              >
                <Link to={`/book/${book.id}`} className="block md:w-1/4">
                  <div className="h-48 md:h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
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
                </Link>
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/book/${book.id}`}>
                      <h2 className="font-bold text-lg mb-1 text-gray-800 hover:text-blue-600">
                        {book.volumeInfo.title}
                      </h2>
                    </Link>
                    {book.volumeInfo.authors?.length > 0 && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">By:</span> {book.volumeInfo.authors.join(', ')}
                      </p>
                    )}
                    {book.volumeInfo.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {formatDescription(book.volumeInfo.description)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-3">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-green-600">
                        ${getBookPrice(book.id).toFixed(2)}
                      </span>
                      
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(book.id, (quantities[book.id] || 1) - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          disabled={(quantities[book.id] || 1) <= 1}
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="px-3 py-1 text-gray-800">
                          {quantities[book.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(book.id, (quantities[book.id] || 1) + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          disabled={(quantities[book.id] || 1) >= 10}
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      
                      <span className="text-sm font-medium text-gray-600">
                        ${(getBookPrice(book.id) * (quantities[book.id] || 1)).toFixed(2)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveFromCart(book.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
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
              className="bg-white rounded-xl shadow-md p-6 mt-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Total Items: {cartBooks.reduce((acc, book) => acc + (quantities[book.id] || 1), 0)}
                  </h3>
                  <h3 className="text-xl font-bold text-green-600 mt-2">
                    Total Price: ${calculateTotal().toFixed(2)}
                  </h3>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300">
                  Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block p-6 bg-white rounded-xl shadow-sm mb-4">
              <FaShoppingCart className="w-16 h-16 mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Looks like you haven't added any books to your cart yet. Start shopping now!
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

export default Cart;