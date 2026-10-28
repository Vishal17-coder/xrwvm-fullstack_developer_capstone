import React, { useState } from "react";
import "./Login.css";

const Login = ({ onClose }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login_url = window.location.origin + "/djangoapp/login";

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(login_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          password: password,
        }),
      });

      const json = await res.json();
      if (json.status === "Authenticated") {
        sessionStorage.setItem("username", json.userName);
        window.location.href = window.location.origin;
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      sessionStorage.setItem("username", userName);
      window.location.href = window.location.origin;
    }
  };

  return (
    <div className="login_container">
      <div className="login_card">
        <h3 className="fw-bold mb-3 text-center" style={{ color: "#0f172a" }}>Sign In</h3>
        <p className="text-muted text-center mb-4">Enter your credentials to access your dealership account</p>
        
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={login}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="form-control"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-muted">
          Don't have an account? <a href="/register" className="text-primary fw-semibold">Register here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
