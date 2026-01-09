import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import JobsResultPage from "./JobsResultPage";
import infologo from "./assets/Infoservices-logo.png";
import Header from "./Header";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const companyDomain = "@infoservices.com";

  const validatePassword = (pwd) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !value.endsWith(companyDomain)) {
      setEmailError(`Email must end with ${companyDomain}`);
    } else {
      setEmailError("");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please fill out all the details");
      return;
    }

    if (emailError) {
      setError("Please enter a valid email");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
      );
      return;
    }

    setError("");
    setLoading(true);

    const userName = email.split("@")[0];

    // Store user info
    localStorage.setItem("userId", email);
    localStorage.setItem("userName", userName);
    localStorage.setItem("hasLoggedInBefore", "true");

    // Navigate after 1.8 seconds
    setTimeout(() => {
      navigate("/Jobs");
    }, 1800);
  };

  return (
    <div className="login-container">
      <div className="logo-wrapper">
        <img src={infologo} alt="Company Logo" className="company-logo" />
      </div>
      <div className="overlay">
        <div className="content-center">
          <h1>Welcome to Referral Buddy</h1>
          <p>
            Your journey to finding the best talent starts here. Let’s make

            your recruitment process smooth and efficient.
          </p>
        </div>

        <div className="login-page">
          <div className="login-box">
            <h2>Sign in </h2>
            {error && (
              <p
                className="error-message"
                style={{ marginBottom: "20px", color: "#d32f2f", fontWeight: "bold" }}
              >
                {error}
              </p>
            )}

            <form onSubmit={handleLogin}>
              <label className="input-label">Email</label>
              <div className="form-group">
                <img src="https://img.icons8.com/ios-glyphs/30/user--v1.png" alt="Email" className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>

              {emailError && <p className="error-message">{emailError}</p>}

              <label className="input-label">Password</label>
              <div className="form-group">
                <img src="https://img.icons8.com/ios-glyphs/30/lock--v1.png" alt="Lock" className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <img
                  src={showPassword ? "https://img.icons8.com/ios-glyphs/30/visible--v1.png" : "https://img.icons8.com/ios-glyphs/30/invisible.png"}
                  alt="Toggle Password"
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>

              <div className="remember-forgot">
                <label className="remember">
                  <input type="checkbox" />Remember Me
                </label>
                <a href="#" className="forgot">
                  Forgot Password?
                </a>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? (
                  <div className="bubble-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  "Log In"
                )}
              </button>

              <div className="sso-divider">
                <span>OR</span>
              </div>

              <button type="button" className="sso-button" onClick={() => {
                const hasLoggedIn = localStorage.getItem("hasLoggedInBefore");
                if (hasLoggedIn) {
                  setLoading(true);
                  setTimeout(() => {
                    localStorage.setItem("userId", "charishmareddy@infoservices.com");
                    localStorage.setItem("userName", "Charishma Reddy");
                    navigate("/Jobs");
                  }, 1500);
                } else {
                  setError("First time user? Please log in manually for the first time.");
                }
              }}>
                <img src={require("./assets/Infoservices-logo.png")} alt="SSO" className="sso-icon" />
                Sign in with Infoservices
              </button>

              <div className="login-footer">
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <Routes>
        {/* Login page – no header */}
        <Route path="/" element={<Login />} />

        {/* Jobs page – with header, passing search props */}
        <Route path="/Jobs" element={
          <JobsResultPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        }
        />
      </Routes>
    </Router>
  );
}

export default App;
