import { useState, useEffect } from "react";
import { ChevronDown, Star, MessageSquare, Users, MapPin, Coffee, PenTool, X, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function ReviewSection() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewType, setReviewType] = useState("hotel");
  const navigate = useNavigate(); // Add this line
  
  // Add state for controlling blur
  const [isBlurred, setIsBlurred] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  // Effect to handle body scroll lock when modal is open
  useEffect(() => {
    if (showReviewForm) {
      document.body.style.overflow = 'hidden';
      setIsBlurred(true);
    } else {
      document.body.style.overflow = 'auto';
      setIsBlurred(false);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showReviewForm]);

  const reviews = [
    {
      id: 1,
      type: "hotel",
      name: "Alex Walker",
      rating: 5,
      date: "March 15, 2025",
      country: "Australia",
      comment: "The dormitory was clean and spacious with comfortable beds. Great secure lockers and power outlets for each bunk.",
      reply: "Thanks Alex! We're glad you enjoyed our newly renovated dormitories."
    },
    {
      id: 2,
      type: "guide",
      name: "Maria Garcia",
      rating: 4,
      date: "March 12, 2025",
      country: "Spain",
      comment: "Great common areas and kitchen facilities. The rooftop terrace was perfect for meeting other travelers."
    },
    {
      id: 3,
      type: "vehicle",
      name: "Jan Kowalski",
      rating: 5,
      date: "March 10, 2025",
      country: "Poland",
      comment: "The staff was incredibly helpful with local recommendations and organizing day trips!"
    }
  ];

  const filteredReviews = activeTab === "all" 
    ? reviews 
    : reviews.filter(review => review.type === activeTab);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll just close the form
    setShowReviewForm(false);
    setRating(0);
    // Reset form fields if needed
  };
  const handleComplaintClick = () => {
    setOpen(false);
    navigate('/complaint');
  };

  const handleEditReview = (id) => {
    const review = reviews.find(r => r.id === id);
    setEditingId(id);
    setEditedComment(review.comment);
  };

  const handleSaveEdit = (id) => {
    // Here you would typically update the review in your backend
    console.log('Saving edited review:', id, editedComment);
    setEditingId(null);
    setEditedComment("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedComment("");
  };

  const handleDeleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      console.log('Deleting review:', id);
      // Add your delete logic here
    }
  };

  return (
    <div className="relative container mx-auto max-w-6xl p-6 font-poppins bg-white rounded-xl shadow-md border border-gray-100">
      {/* Main content - will be blurred when modal opens */}
      <div className={`transition-all duration-500 ${isBlurred ? 'filter blur-md' : ''}`}>
        {/* Section Heading with premium gradient */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Traveler Experience
          </h1>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4"></div>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Authentic feedback from global travelers to help you find your perfect stay
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 bg-blue-50 p-1 rounded-lg mb-4 md:mb-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === "all"
                  ? "bg-white shadow-sm text-blue-600 border border-blue-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setActiveTab("hotel")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === "hotel"
                  ? "bg-white shadow-sm text-blue-600 border border-blue-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Hotel 
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === "guide"
                  ? "bg-white shadow-sm text-blue-600 border border-blue-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Guide 
            </button>
            <button
              onClick={() => setActiveTab("vehicle")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === "vehicle"
                  ? "bg-white shadow-sm text-blue-600 border border-blue-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Vehicle
            </button>
          </div>

          {/* Action Buttons Group */}
          <div className="flex space-x-3">
            {/* Add Review Button - More Elegant */}
            <button 
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 border border-blue-400"
            >
              <PenTool className="h-4 w-4" />
              Add Review
            </button>

            {/* Dropdown - Kept as requested */}
            <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm bg-white border border-blue-200 text-blue-600 shadow-sm hover:shadow-md transition-all duration-300"
        >
          Feedback{" "}
          <ChevronDown
            className={`h-4 w-4 transform ${
              open ? "rotate-180" : ""
            } transition-transform`}
          />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-xl z-10 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 text-sm font-medium text-gray-700">
              Options
            </div>
            {/* Modified complaint button with navigation */}
            <button 
              onClick={handleComplaintClick}
              className="flex items-center px-4 py-3 text-sm w-full text-left hover:bg-blue-50 transition"
            >
              <Users className="h-4 w-4 mr-3 text-blue-500" />
              Complaint
            </button>
          </div>
        )}
             
            </div>
          </div>
        </div>

        {/* Review Cards - Premium Style with Blue Theme & Yellow Stars */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
              <div className="flex justify-between items-start flex-wrap mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditReview(review.id)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit review"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                  ${review.type === "hotel" ? "bg-blue-100 text-blue-700" : ""}
                  ${review.type === "guide" ? "bg-teal-100 text-teal-700" : ""}
                  ${review.type === "vehicle" ? "bg-purple-100 text-purple-700" : ""}
                `}>
                  {review.type}
                </span>
              </div>
              <div className="flex justify-between items-start flex-wrap">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 mr-4 border border-blue-200 text-sm font-medium">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center flex-wrap">
                      <h4 className="font-medium text-gray-900">{review.name}</h4>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{review.country}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          } mr-0.5`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-2">{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {editingId === review.id ? (
                <div className="mt-4">
                  <textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    rows="4"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(review.id)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm hover:shadow-md transition-all text-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-gray-700 leading-relaxed">{review.comment}</p>
              )}
              
              {review.reply && (
                <div className="mt-4 ml-4 pl-4 border-l-2 border-blue-200">
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                    Response from staff:
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{review.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 text-center">
            <div className="text-3xl font-bold text-blue-600">4.8</div>
            <div className="text-sm text-gray-600 mt-1">Overall Rating</div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-4 rounded-lg border border-teal-100 text-center">
            <div className="text-3xl font-bold text-teal-600">94%</div>
            <div className="text-sm text-gray-600 mt-1">Would Recommend</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 text-center">
            <div className="text-3xl font-bold text-indigo-600">3k+</div>
            <div className="text-sm text-gray-600 mt-1">Happy Travelers</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100 text-center">
            <div className="text-3xl font-bold text-purple-600">500+</div>
            <div className="text-sm text-gray-600 mt-1">Verified Reviews</div>
          </div>
        </div>

        {/* Call To Action */}
        <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl text-center border border-blue-100">
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Your Experience Matters
          </h3>
          <p className="text-gray-600 mb-4">
            Help future travelers make informed decisions with your honest feedback
          </p>
          <button 
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-md transition-all duration-300"
          >
            Share Your Story
          </button>
        </div>
      </div>

      {/* Enhanced Review Form Modal - Positioned as an overlay without black background */}
      {showReviewForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto transform transition-all animate-[popIn_0.3s_ease-out] scale-100 opacity-100 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "popIn 0.3s ease-out",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
          >
            {/* Modal Header with Gradient - Sticky */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-xl p-5">
              <button 
                onClick={() => setShowReviewForm(false)}
                className="absolute top-4 right-4 text-white hover:text-blue-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-bold text-white">Share Your Experience</h3>
              <p className="text-blue-100 text-sm mt-1">Let others know about your journey</p>
            </div>
            
            {/* Modal Body with enhanced styling */}
            <form onSubmit={handleSubmitReview} className="p-6 bg-gradient-to-br from-white to-blue-50">
              {/* Personal Info */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="United States"
                    required
                  />
                </div>
              </div>
              
              {/* Review Type - Enhanced */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewType("hotel")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      reviewType === "hotel"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                        : "border border-gray-300 text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    Hotel
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewType("guide")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      reviewType === "guide"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                        : "border border-gray-300 text-gray-700 hover:bg-teal-50"
                    }`}
                  >
                    Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewType("vehicle")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      reviewType === "vehicle"
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                        : "border border-gray-300 text-gray-700 hover:bg-purple-50"
                    }`}
                  >
                    Vehicle
                  </button>
                </div>
              </div>
              
              {/* Rating - Enhanced */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer transform transition-transform duration-200 hover:scale-110 ${
                        (hoverRating || rating) >= star
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                          : "text-gray-300"
                      } mr-1`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                  <span className="ml-3 text-sm text-gray-600">
                    {rating > 0 ? `${rating} ${rating === 1 ? 'star' : 'stars'}` : 'Select rating'}
                  </span>
                </div>
              </div>
              
              {/* Review Comment - Enhanced */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="Share details about your experience to help other travelers..."
                  rows="4"
                  required
                ></textarea>
              </div>
              
              {/* Upload Photos - Enhanced */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Photos (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-white">
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Drag and drop photos here or click to browse</p>
                  <input type="file" className="hidden" accept="image/*" multiple />
                </div>
              </div>
              
              {/* Submit Button - Enhanced */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all hover:shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 border border-blue-400 hover:scale-105 transform"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes popIn {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          45% {
            transform: scale(1.02);
          }
          80% {
            transform: scale(0.98);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}