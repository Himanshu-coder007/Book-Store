// src/components/ReviewCard.jsx
import { motion } from 'framer-motion'

const ReviewCard = ({ review }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-pink-900/70 via-pink-800/60 to-purple-900/70 p-6 rounded-lg border border-pink-800/30 shadow-sm hover:shadow-md transition-all hover:border-pink-800/50"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-xl font-bold text-white shadow-sm">
            {review.userInitials}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-100">{review.userName}</h4>
            <div className="flex items-center gap-1 text-amber-300">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < review.rating ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-pink-200/80 mt-1">{review.date}</p>
          <p className="mt-3 text-gray-100">{review.comment}</p>
          {review.bookTitle && (
            <p className="mt-2 text-sm text-amber-200 font-medium">
              Reviewed: {review.bookTitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ReviewCard;