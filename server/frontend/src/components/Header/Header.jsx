import React from "react";
import "./Header.css";

const Header = () => {
  const logout = async () => {
    const logout_url = window.location.origin + "/djangoapp/logout";
    try {
      const res = await fetch(logout_url, { method: "GET" });
      const json = await res.json();
      if (json) {
        let username = sessionStorage.getItem("username");
        sessionStorage.removeItem("username");
        window.location.href = window.location.origin;
        alert("Logging out " + username);
      }
    } catch (e) {
      sessionStorage.removeItem("username");
      window.location.href = window.location.origin;
    }
  };

  const curr_user = sessionStorage.getItem("username");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold text-info" href="/">
          <i className="fa-solid fa-car me-2"></i>Dealership Central
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact">
                Contact Us
              </a>
            </li>
          </ul>
          <span className="navbar-text">
            {curr_user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-white fw-semibold">
                  <i className="fa-solid fa-circle-user text-info me-1"></i>
                  {curr_user}
                </span>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <a className="btn btn-outline-info btn-sm" href="/login">
                  Login
                </a>
                <a className="btn btn-info btn-sm text-dark fw-semibold" href="/register">
                  Register
                </a>
              </div>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
