import React, { useState, useEffect } from "react";
import "./Dealers.css";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("All");

  const dealer_url = "/djangoapp/get_dealers";

  const filterDealers = async (state) => {
    setSelectedState(state);
    let url = dealer_url;
    if (state !== "All") {
      url = `/djangoapp/get_dealers/${state}`;
    }
    try {
      const res = await fetch(url, { method: "GET" });
      const retobj = await res.json();
      if (retobj.status === 200 && retobj.dealers) {
        setDealersList(retobj.dealers);
      }
    } catch (e) {
      console.error("Error fetching filtered dealers:", e);
    }
  };

  const get_dealers = async () => {
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      const retobj = await res.json();
      if (retobj.status === 200 && retobj.dealers) {
        let all_dealers = Array.from(retobj.dealers);
        let statesList = [];
        all_dealers.forEach((dealer) => {
          if (dealer.state && !statesList.includes(dealer.state)) {
            statesList.push(dealer.state);
          }
        });
        statesList.sort();
        setStates(statesList);
        setDealersList(all_dealers);
      }
    } catch (e) {
      console.error("Error fetching dealers:", e);
    }
  };

  useEffect(() => {
    get_dealers();
  }, []);

  const isLoggedIn = Boolean(sessionStorage.getItem("username"));

  return (
    <div className="container my-5">
      <div className="dealers-header-section mb-4 p-4 rounded-4 shadow-sm bg-white border">
        <div className="row align-items-center">
          <div className="col-md-7">
            <h2 className="fw-bold text-dark mb-1">
              <i className="fa-solid fa-warehouse text-primary me-2"></i>
              Certified Dealership Network
            </h2>
            <p className="text-secondary mb-0">
              Browse nationwide verified automotive dealerships, customer ratings, and honest reviews.
            </p>
          </div>
          <div className="col-md-5 mt-3 mt-md-0 d-flex justify-content-md-end align-items-center gap-2">
            <label htmlFor="state-select" className="fw-semibold text-secondary text-nowrap">
              Filter by State:
            </label>
            <select
              id="state-select"
              className="form-select w-auto shadow-sm"
              value={selectedState}
              onChange={(e) => filterDealers(e.target.value)}
            >
              <option value="All">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive bg-white rounded-4 shadow-sm border p-3">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-uppercase fs-7 text-secondary">
            <tr>
              <th scope="col" style={{ width: "80px" }}>ID</th>
              <th scope="col">Dealer Name</th>
              <th scope="col">City</th>
              <th scope="col">Address</th>
              <th scope="col">Zip</th>
              <th scope="col">State</th>
              {isLoggedIn && <th scope="col" className="text-center">Review Dealer</th>}
            </tr>
          </thead>
          <tbody>
            {dealersList.length > 0 ? (
              dealersList.map((dealer) => (
                <tr key={dealer.id}>
                  <td className="fw-bold text-muted">{dealer.id}</td>
                  <td>
                    <a
                      href={`/dealer/${dealer.id}`}
                      className="fw-bold text-primary text-decoration-none dealer-name-link"
                    >
                      {dealer.full_name}
                    </a>
                  </td>
                  <td>{dealer.city}</td>
                  <td className="text-secondary">{dealer.address}</td>
                  <td><span className="badge bg-light text-dark border">{dealer.zip}</span></td>
                  <td>
                    <span className="badge bg-primary-subtle text-primary px-2 py-1">
                      {dealer.state}
                    </span>
                  </td>
                  {isLoggedIn && (
                    <td className="text-center">
                      <a
                        href={`/postreview/${dealer.id}`}
                        className="btn btn-sm btn-outline-primary fw-semibold px-3"
                      >
                        <i className="fa-regular fa-comment-dots me-1"></i>
                        Review Dealer
                      </a>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isLoggedIn ? "7" : "6"} className="text-center py-5 text-muted">
                  <i className="fa-solid fa-spinner fa-spin fa-2x mb-2 text-primary"></i>
                  <p className="mb-0">Loading dealership data...</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dealers;
