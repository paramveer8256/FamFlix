import React, { useEffect, useState } from "react";
import axios from "axios";

const Review = ({ id, category }) => {
  const [reviews, setReviews] = useState([]);
  const [expandedId, setExpandedId] = useState(null); // Only one expanded

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `/api/v1/${category}/reviews/${id}`
        );
        if (response.data.success) {
          setReviews(response.data.content);
        } else {
          console.error(
            "Failed to fetch reviews:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [id, category]);

  const handleToggle = (reviewId) => {
    setExpandedId((prevId) =>
      prevId === reviewId ? null : reviewId
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <h2 className="text-2xl text-[#1E90FF] font-semibold mb-4">
        Featured reviews:
      </h2>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 ">
          {reviews.length === 0 && (
            <div className="text-gray-400">
              No reviews available for this movie.
            </div>
          )}
          {reviews.map((review) => {
            const isExpanded = expandedId === review.id;
            const contentPreview = review.content.slice(
              0,
              200
            );
            const showToggle = review.content.length > 200;
            if (!review.content) return null; // Skip if content is empty
            return (
              <div
                key={review.id}
                onClick={
                  showToggle
                    ? () => handleToggle(review.id)
                    : undefined
                }
                className={`cursor-pointer min-w-[300px] max-w-sm bg-white/10 rounded-lg shadow-md transition-all duration-300 p-4 flex flex-col justify-between ${
                  isExpanded
                    ? "h-auto"
                    : "h-[220px] overflow-hidden"
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-gray-200 mb-2">
                    <span className="text-yellow-500">
                      ★{" "}
                      {review.author_details?.rating || "5"}
                    </span>
                    <span>{review.author}</span>
                  </div>

                  <p className="text-sm text-gray-400 whitespace-pre-line">
                    {isExpanded
                      ? review.content
                      : `${contentPreview}...`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Review;
