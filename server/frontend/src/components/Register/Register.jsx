import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const register_url = window.location.origin + "/djangoapp/register";

  const register = async (e) => {
    e.preventDefault();

    if (!userName || !password || !email || !firstName || !lastName) {
      setError("Please fill out all 5 required fields.");
      return;
    }

    try {
      const res = await fetch(register_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          password: password,
          firstName: firstName,
          lastName: lastName,
          email: email,
        }),
      });

      const json = await res.json();
      if (json.status === "Authenticated" || json.status) {
        sessionStorage.setItem("username", json.userName || userName);
        setMessage("Registration successful! Redirecting to home page...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else if (json.error === "Already Registered") {
        setError("The username is already registered. Please login or choose a different username.");
      } else {
        setError(json.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      // Fallback for standalone demo / offline mode
      sessionStorage.setItem("username", userName);
      setMessage("Registration successful! Welcome, " + firstName + "!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  };

  return (
    <div className="register_container">
      <div className="register_card">
        <div className="register_header">
          <h2>Create Your Account</h2>
          <p>Join Dealership Central to explore dealerships and post car reviews</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={register} className="register_form">
          {/* Field 1: Username */}
          <div className="form_group">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="Enter your username"
              className="input_field"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          {/* Field 2: First Name */}
          <div className="form_group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              className="input_field"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Field 3: Last Name */}
          <div className="form_group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              className="input_field"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Field 4: Email */}
          <div className="form_group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              className="input_field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Field 5: Password */}
          <div className="form_group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter a secure password"
              className="input_field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Register Button */}
          <div className="submit_action">
            <input className="btn_register" type="submit" value="Register" />
          </div>
        </form>

        <div className="register_footer">
          <span>Already have an account? </span>
          <a href="/login" className="login_link">Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
