// src/components/ReviewsSection.jsx
import { motion } from 'framer-motion'
import ReviewCard from './ReviewCard'

const dummyReviews = [
  {
    id: 1,
    userName: 'Alex Johnson',
    userInitials: 'AJ',
    rating: 5,
    date: '2 days ago',
    comment: 'This book completely changed my perspective on modern literature. The character development was exceptional!',
    bookTitle: 'The Midnight Library'
  },
  {
    id: 2,
    userName: 'Sarah Miller',
    userInitials: 'SM',
    rating: 4,
    date: '1 week ago',
    comment: 'Engaging plot with unexpected twists. The ending felt a bit rushed but overall a great read.',
    bookTitle: 'Project Hail Mary'
  },
  {
    id: 3,
    userName: 'David Chen',
    userInitials: 'DC',
    rating: 5,
    date: '3 weeks ago',
    comment: 'One of the best sci-fi novels I\'ve read in years. The world-building is incredible and the science feels plausible.',
    bookTitle: 'Dune'
  },
  
]

const ReviewsSection = () => {
  return (
    <section className="mt-16">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-gray-100 mb-8 flex items-center gap-3"
      >
        <span className="h-1 w-12 bg-blue-500 rounded-full"></span>
        Recent Community Reviews
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  )
}

export default ReviewsSection