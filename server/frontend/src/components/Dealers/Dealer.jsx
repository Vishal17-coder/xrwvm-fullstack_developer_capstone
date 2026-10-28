import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Dealer.css";

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const { id } = useParams();

  const root_url = window.location.origin;
  const dealer_url = `${root_url}/djangoapp/dealer/${id}`;
  const reviews_url = `${root_url}/djangoapp/reviews/dealer/${id}`;

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      const retobj = await res.json();
      if (retobj.status === 200 && retobj.dealer) {
        setDealer(retobj.dealer);
      }
    } catch (e) {
      console.error("Error fetching dealer:", e);
    }
  };

  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url, { method: "GET" });
      const retobj = await res.json();
      if (retobj.status === 200 && retobj.reviews) {
        if (retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      }
    } catch (e) {
      console.error("Error fetching reviews:", e);
      setUnreviewed(true);
    }
  };

  const senti_icon = (sentiment) => {
    let senti = sentiment ? sentiment.toLowerCase() : "neutral";
    if (senti === "positive") {
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fs-7">
          <i className="fa-solid fa-thumbs-up me-1"></i> Positive
        </span>
      );
    } else if (senti === "negative") {
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill fs-7">
          <i className="fa-solid fa-thumbs-down me-1"></i> Negative
        </span>
      );
    } else {
      return (
        <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2 rounded-pill fs-7">
          <i className="fa-solid fa-minus me-1"></i> Neutral
        </span>
      );
    }
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
  }, [id]);

  const isLoggedIn = Boolean(sessionStorage.getItem("username"));

  return (
    <div className="container my-5">
      {/* Dealer Header Card */}
      <div className="dealer-hero-card p-4 rounded-4 shadow-sm bg-white border mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h1 className="fw-bold mb-2 text-dark">
              {dealer.full_name || "Dealership Details"}
            </h1>
            <p className="text-secondary mb-0">
              <i className="fa-solid fa-location-dot text-primary me-2"></i>
              {dealer.address}, {dealer.city}, {dealer.state} - {dealer.zip}
            </p>
          </div>
          <div>
            {isLoggedIn && (
              <a href={`/postreview/${id}`} className="btn btn-primary fw-semibold px-4 py-2">
                <i className="fa-solid fa-pen-to-square me-2"></i>Post a Review
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3 className="fw-bold mb-4 text-dark">Customer Reviews & Sentiment</h3>

        {reviews.length > 0 ? (
          <div className="row g-4">
            {reviews.map((review, index) => (
              <div className="col-md-6" key={review.id || index}>
                <div className="card h-100 review-card border rounded-4 shadow-sm p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="fw-bold mb-1 text-dark">
                        <i className="fa-solid fa-user-circle text-secondary me-2"></i>
                        {review.name || "Customer"}
                      </h5>
                      {review.car_make && (
                        <p className="text-muted small mb-0">
                          Car: <strong>{review.car_make} {review.car_model}</strong> ({review.car_year})
                        </p>
                      )}
                    </div>
                    <div>{senti_icon(review.sentiment)}</div>
                  </div>
                  <p className="review-text text-secondary mb-3">"{review.review}"</p>
                  {review.purchase_date && (
                    <div className="text-muted small mt-auto border-top pt-2">
                      <i className="fa-regular fa-calendar-check me-1"></i> Purchased on: {review.purchase_date}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : unreviewed ? (
          <div className="alert alert-light border rounded-4 p-5 text-center text-secondary">
            <i className="fa-regular fa-comment-dots fa-3x mb-3 text-muted"></i>
            <h4>No reviews yet for this dealer</h4>
            <p>Be the first customer to share your vehicle purchase experience!</p>
            {isLoggedIn ? (
              <a href={`/postreview/${id}`} className="btn btn-outline-primary">
                Post First Review
              </a>
            ) : (
              <a href="/login" className="btn btn-outline-primary">
                Login to Post Review
              </a>
            )}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="fa-solid fa-spinner fa-spin fa-2x text-primary mb-2"></i>
            <p className="text-muted">Loading reviews...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dealer;
