// src/components/ReviewCard.jsx
import { motion } from 'framer-motion'

const ReviewCard = ({ review }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-xl font-bold">
            {review.userInitials}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-100">{review.userName}</h4>
            <div className="flex items-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < review.rating ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-1">{review.date}</p>
          <p className="mt-3 text-gray-300">{review.comment}</p>
          {review.bookTitle && (
            <p className="mt-2 text-sm text-blue-400">
              Reviewed: {review.bookTitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ReviewCard