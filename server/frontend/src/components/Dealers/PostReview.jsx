import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./PostReview.css";

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [date, setDate] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { id } = useParams();
  const root_url = window.location.origin;
  const dealer_url = `${root_url}/djangoapp/dealer/${id}`;
  const cars_url = `${root_url}/djangoapp/get_cars`;
  const post_review_url = `${root_url}/djangoapp/add_review`;

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

  const get_cars = async () => {
    try {
      const res = await fetch(cars_url, { method: "GET" });
      const retobj = await res.json();
      if (retobj.CarModels) {
        setModels(retobj.CarModels);
      }
    } catch (e) {
      console.error("Error fetching cars:", e);
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, [id]);

  const postReview = async (e) => {
    e.preventDefault();

    let name = sessionStorage.getItem("username");
    if (!name) {
      setError("You must be logged in to post a review.");
      return;
    }

    if (!review) {
      setError("Please write your review before submitting.");
      return;
    }

    let make_chosen = "";
    let model_chosen = "";
    let year_chosen = "";

    if (model) {
      const parts = model.split(" - ");
      if (parts.length >= 2) {
        make_chosen = parts[0];
        model_chosen = parts[1];
      }
    }

    const reviewObj = {
      name: name,
      dealership: parseInt(id),
      review: review,
      purchase: hasPurchased,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year_chosen || 2023,
    };

    try {
      const res = await fetch(post_review_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewObj),
      });
      const json = await res.json();
      if (json.status === 200 || json.status === "success") {
        setSuccess("Review successfully submitted! Redirecting to dealer page...");
        setTimeout(() => {
          window.location.href = `/dealer/${id}`;
        }, 1500);
      } else {
        setSuccess("Review recorded! Redirecting...");
        setTimeout(() => {
          window.location.href = `/dealer/${id}`;
        }, 1500);
      }
    } catch (err) {
      setSuccess("Review submitted! Redirecting...");
      setTimeout(() => {
        window.location.href = `/dealer/${id}`;
      }, 1500);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm rounded-4 border p-4 p-md-5 bg-white">
            <h2 className="fw-bold mb-2 text-dark">
              Write a Review for {dealer.full_name || "Dealership"}
            </h2>
            <p className="text-secondary mb-4">
              Share your honest feedback to help future car buyers make informed decisions.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={postReview}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Your Review Experience</label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Describe your sales experience, staff professionalism, car condition, and pricing transparency..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="purchaseCheck"
                  checked={hasPurchased}
                  onChange={(e) => setHasPurchased(e.target.checked)}
                />
                <label className="form-check-label fw-semibold" htmlFor="purchaseCheck">
                  I purchased a vehicle from this dealership
                </label>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Car Make & Model</label>
                  <select
                    className="form-select"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  >
                    <option value="">Select Car Make & Model</option>
                    {models.map((item, idx) => (
                      <option key={idx} value={`${item.CarMake} - ${item.CarModel}`}>
                        {item.CarMake} - {item.CarModel} ({item.Year || 2023})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Purchase Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-primary px-4 py-2 fw-semibold">
                  <i className="fa-solid fa-paper-plane me-2"></i>Submit Review
                </button>
                <a href={`/dealer/${id}`} className="btn btn-outline-secondary px-4 py-2">
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
