import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  CheckCircle, 
  X,
  MessageSquare,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Flag
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const ratingOptions = ['All', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'];
  const statusOptions = ['All', 'Approved', 'Pending', 'Rejected'];

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setReviews([
        {
          id: '1',
          productId: 'PRD001',
          productName: 'Fresh Organic Apples',
          productImage: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=100',
          userId: 'USR001',
          userName: 'Sarah Johnson',
          userEmail: 'sarah@example.com',
          rating: 5,
          title: 'Excellent quality apples!',
          comment: 'These apples are absolutely fresh and delicious. The quality is outstanding and they arrived perfectly packaged. Will definitely order again!',
          status: 'approved',
          isVerified: true,
          helpfulVotes: 12,
          reportCount: 0,
          createdAt: '2024-01-20',
          moderatedAt: '2024-01-20',
          moderatedBy: 'Admin'
        },
        {
          id: '2',
          productId: 'PRD002',
          productName: 'Farm Fresh Milk',
          productImage: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=100',
          userId: 'USR002',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          rating: 4,
          title: 'Good quality milk',
          comment: 'Fresh milk with good taste. Delivery was quick and packaging was secure.',
          status: 'pending',
          isVerified: true,
          helpfulVotes: 5,
          reportCount: 0,
          createdAt: '2024-01-19',
          moderatedAt: null,
          moderatedBy: null
        },
        {
          id: '3',
          productId: 'PRD003',
          productName: 'Whole Grain Bread',
          productImage: 'https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?auto=compress&cs=tinysrgb&w=100',
          userId: 'USR003',
          userName: 'Mike Wilson',
          userEmail: 'mike@example.com',
          rating: 2,
          title: 'Not as expected',
          comment: 'The bread was a bit stale when it arrived. Expected better quality for the price.',
          status: 'pending',
          isVerified: false,
          helpfulVotes: 2,
          reportCount: 1,
          createdAt: '2024-01-18',
          moderatedAt: null,
          moderatedBy: null
        },
        {
          id: '4',
          productId: 'PRD004',
          productName: 'Fresh Baby Spinach',
          productImage: 'https://images.pexels.com/photos/2068303/pexels-photo-2068303.jpeg?auto=compress&cs=tinysrgb&w=100',
          userId: 'USR004',
          userName: 'Emma Davis',
          userEmail: 'emma@example.com',
          rating: 5,
          title: 'Perfect for salads!',
          comment: 'Very fresh spinach leaves, perfect for my daily salads. Great quality and fast delivery.',
          status: 'approved',
          isVerified: true,
          helpfulVotes: 8,
          reportCount: 0,
          createdAt: '2024-01-17',
          moderatedAt: '2024-01-17',
          moderatedBy: 'Admin'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === '' || ratingFilter === 'All' || 
                         review.rating === parseInt(ratingFilter.split(' ')[0]);
    const matchesStatus = statusFilter === '' || statusFilter === 'All' || 
                         review.status === statusFilter.toLowerCase();
    return matchesSearch && matchesRating && matchesStatus;
  });

  const handleApprove = (id) => {
    setReviews(reviews.map(review => 
      review.id === id 
        ? { 
            ...review, 
            status: 'approved',
            moderatedAt: new Date().toISOString().split('T')[0],
            moderatedBy: 'Admin'
          } 
        : review
    ));
    toast.success('Review approved successfully');
  };

  const handleReject = (id) => {
    setReviews(reviews.map(review => 
      review.id === id 
        ? { 
            ...review, 
            status: 'rejected',
            moderatedAt: new Date().toISOString().split('T')[0],
            moderatedBy: 'Admin'
          } 
        : review
    ));
    toast.success('Review rejected');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(r => r.id !== id));
      toast.success('Review deleted successfully');
    }
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const reviewStats = [
    { label: 'Total Reviews', value: reviews.length, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Review', value: reviews.filter(r => r.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Approved', value: reviews.filter(r => r.status === 'approved').length, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Average Rating', value: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1), color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="loading-skeleton h-32 rounded-card"></div>
          ))}
        </div>
        <div className="loading-skeleton h-96 rounded-card"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Reviews</h1>
          <p className="text-neutral-600 mt-1">Manage customer reviews and feedback</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-neutral-600">
            {reviews.filter(r => r.status === 'pending').length} pending review(s)
          </span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {reviewStats.map((stat, index) => (
          <motion.div
            key={index}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-card`}>
                <div className={`w-6 h-6 ${stat.color} rounded-full`}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reviews by product, customer, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-search"
            />
          </div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="input-field md:w-40"
          >
            {ratingOptions.map(rating => (
              <option key={rating} value={rating === 'All' ? '' : rating}>
                {rating}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field md:w-40"
          >
            {statusOptions.map(status => (
              <option key={status} value={status === 'All' ? '' : status}>
                {status}
              </option>
            ))}
          </select>
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </motion.button>
        </div>
      </motion.div>

      {/* Reviews List */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <AnimatePresence>
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="card hover:shadow-card-hover"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <img
                  src={review.productImage}
                  alt={review.productName}
                  className="w-16 h-16 object-cover rounded-card flex-shrink-0"
                />

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-neutral-800">{review.productName}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(review.status)}`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                      {review.isVerified && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {review.reportCount > 0 && (
                        <span className="flex items-center space-x-1 text-red-600 text-sm">
                          <Flag className="w-4 h-4" />
                          <span>{review.reportCount}</span>
                        </span>
                      )}
                      <motion.button
                        onClick={() => handleViewDetails(review)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs">
                          {review.userName.split(' ').map(n => n.charAt(0)).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800">{review.userName}</p>
                        <p className="text-xs text-neutral-600">{review.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium text-neutral-700 ml-2">{review.rating}/5</span>
                    </div>
                  </div>

                  {review.title && (
                    <h4 className="font-medium text-neutral-800 mb-2">{review.title}</h4>
                  )}
                  
                  <p className="text-neutral-700 mb-4 leading-relaxed">{review.comment}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-neutral-600">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpfulVotes} helpful</span>
                      </div>
                      {review.moderatedBy && (
                        <span>Moderated by {review.moderatedBy}</span>
                      )}
                    </div>

                    {review.status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => handleReject(review.id)}
                          className="btn-ghost text-red-600 hover:text-red-700 text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </motion.button>
                        <motion.button
                          onClick={() => handleApprove(review.id)}
                          className="btn-primary text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </motion.button>
                      </div>
                    )}

                    {review.status !== 'pending' && (
                      <motion.button
                        onClick={() => handleDelete(review.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Review Details Modal */}
      <AnimatePresence>
        {showModal && selectedReview && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-card shadow-card-hover w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-800">Review Details</h2>
                  <motion.button
                    onClick={() => setShowModal(false)}
                    className="text-neutral-500 hover:text-neutral-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Product Info */}
                  <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-card">
                    <img
                      src={selectedReview.productImage}
                      alt={selectedReview.productName}
                      className="w-16 h-16 object-cover rounded-card"
                    />
                    <div>
                      <h3 className="font-semibold text-neutral-800">{selectedReview.productName}</h3>
                      <p className="text-sm text-neutral-600">Product ID: {selectedReview.productId}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-3">Customer Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-neutral-600" />
                          <span>{selectedReview.userName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-neutral-600">Email:</span>
                          <span>{selectedReview.userEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-neutral-600" />
                          <span>Reviewed on {selectedReview.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-3">Review Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <ThumbsUp className="w-4 h-4 text-neutral-600" />
                          <span>{selectedReview.helpfulVotes} helpful votes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Flag className="w-4 h-4 text-neutral-600" />
                          <span>{selectedReview.reportCount} reports</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-neutral-600" />
                          <span>{selectedReview.isVerified ? 'Verified Purchase' : 'Unverified'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-3">Review Content</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-neutral-600">Rating:</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(selectedReview.rating)}
                          <span className="font-medium ml-2">{selectedReview.rating}/5</span>
                        </div>
                      </div>
                      
                      {selectedReview.title && (
                        <div>
                          <span className="text-neutral-600">Title:</span>
                          <p className="font-medium text-neutral-800 mt-1">{selectedReview.title}</p>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-neutral-600">Comment:</span>
                        <p className="text-neutral-800 mt-1 leading-relaxed">{selectedReview.comment}</p>
                      </div>
                    </div>
                  </div>

                  {/* Moderation Actions */}
                  {selectedReview.status === 'pending' && (
                    <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-200">
                      <motion.button
                        onClick={() => {
                          handleReject(selectedReview.id);
                          setShowModal(false);
                        }}
                        className="btn-ghost text-red-600"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject Review
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          handleApprove(selectedReview.id);
                          setShowModal(false);
                        }}
                        className="btn-primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Review
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReviews;