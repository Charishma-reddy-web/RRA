import React, { useState, useEffect, useRef } from "react";
import "./Header.css";

import { useNavigate } from "react-router-dom";
import ReferralDetailsView from "./ReferralViewDetails"; // Import Detail View

export default function Header({ user, searchQuery, setSearchQuery, referrals }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Retrieve user info from localStorage if not passed as prop
  const storedName = localStorage.getItem("userName");
  const storedEmail = localStorage.getItem("userId");

  const currentUser = user || {
    name: storedName || "Guest User",
    email: storedEmail || "example@email.com",
  };

  const getInitials = (name) => {
    if (!name) return "GU";
    const parts = name.split(/[ ._]+/).filter(Boolean);
    if (parts.length === 0) return "GU";
    if (parts.length === 1) {
      return parts[0].length > 1 ? parts[0].substring(0, 2).toUpperCase() : parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [showReferralsModal, setShowReferralsModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null); // State for selected referral details

  return (
    <>
      <div className="header-dock">

        {/* 0. BRAND TITLE (With Logo) */}
        <div style={{ display: "flex", alignItems: "center", gap: "75px" }}>
          <img src={require("./assets/Infoservices-logo.png")} alt="Logo" style={{ height: "30px" }} />
          <h2 className="header-brand-title">Referral Buddy</h2>
        </div>

        <div className="header-tools">
          {/* 1. SEARCH BAR (New Feature) */}
          <div className="glass-search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search jobs, skills, Experience, or ID..."
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            />
          </div>

          {/* 2. PROFILE PILL ( Minimized ) */}
          <div className="user-dropdown-wrapper" ref={dropdownRef}>
            <div className="glass-profile-pill" onClick={() => setOpen(!open)} style={{ padding: "5px", borderRadius: "50%", gap: 0 }}>
              <div className="pill-avatar" style={{ margin: 0 }}>{getInitials(currentUser.name)}</div>
            </div>

            {open && (
              <div className="dropdown-glass">
                {/* Row 1: Top Bar (Brand + Sign Out) */}
                <div className="dropdown-top-bar">
                  <span className="brand-text">infoservices.com</span>
                  <span className="sign-out-link" onClick={() => {
                    localStorage.removeItem("userId");
                    localStorage.removeItem("userName");
                    navigate("/");
                  }}>Sign out</span>
                </div>

                {/* Row 2: Profile Content */}
                <div className="profile-card-content">
                  <div className="big-avatar">{getInitials(currentUser.name)}</div>
                  <div className="profile-details-col">
                    <h3 className="profile-name">{currentUser.name}</h3>
                    <p className="profile-email">{currentUser.email}</p>
                  </div>
                </div>

                {/* Row 3: Menu Items (Teams style list) */}
                <div className="dropdown-menu-list">
                  <div className="menu-list-item" onClick={() => { setOpen(false); setShowReferralsModal(true); }}>
                    <div className="menu-item-left">
                      <span>My Referrals</span>
                    </div>
                    <span className="menu-chevron">›</span>
                  </div>
                </div>
              </div>

            )}
          </div>
        </div>
      </div >

      {/* MY REFERRALS MODAL */}
      {
        showReferralsModal && (
          <div className="fullPageOverlay">
            <div className="fullPageModal" style={{ maxWidth: "600px", position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                gap: '8px' // Slightly increased gap
              }}>
                {selectedReferral && (
                  <button
                    onClick={() => setSelectedReferral(null)}
                    style={{
                      background: '#fff',
                      border: '1px solid #eee',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      color: '#666',
                      lineHeight: '1',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '32px',
                      width: '32px'
                    }}
                  >
                    ←
                  </button>
                )}
                <button
                  className="fullPageCloseBtn"
                  onClick={() => { setShowReferralsModal(false); setSelectedReferral(null); }}
                  style={{
                    position: 'static',
                    margin: 0,
                    transform: 'none',
                    background: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    height: '32px',
                    width: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    color: '#666'
                  }}
                >
                  ✕
                </button>
              </div>

              {selectedReferral ? (
                <ReferralDetailsView
                  referral={selectedReferral}
                  onBack={() => setSelectedReferral(null)}
                />
              ) : (
                <>
                  <div className="modal-header-row">
                    <h2>My Referrals</h2>
                  </div>

                  <div className="referrals-list" style={{ maxHeight: "400px", overflowY: "auto", marginTop: "20px" }}>
                    {(referrals && referrals.filter(r => r.CandidateName).length > 0) ? (
                      referrals.filter(r => r.CandidateName).map((ref, idx) => (
                        <div key={idx}
                          onClick={() => setSelectedReferral(ref)}
                          style={{
                            padding: "15px",
                            marginBottom: "10px",
                            background: "rgba(0,0,0,0.03)",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                            transition: "background 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.06)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.03)"}
                        >
                          <div>
                            <h4 style={{ margin: "0 0 2px 0", color: "#333" }}>{ref.CandidateName}</h4>
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#888" }}>{ref.JobTitle}</p>
                          </div>
                          <span style={{ fontSize: "1.2rem", color: "#999", fontWeight: "bold" }}>›</span>
                        </div>
                      ))
                    ) : (
                      <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>No referrals found.</p>
                    )}
                  </div>
                </>
              )}

            </div>
          </div>
        )
      }
    </>
  );
}
