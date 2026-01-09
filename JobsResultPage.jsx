import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./JobsResultPage.css";
import Sidebar from "./Sidebar";
import CountUp from 'react-countup';
import JobCard from "./JobCard";
import ChatWidget from "./ChatWidget";
import Header from "./Header";

const JobsResultPage = ({ searchQuery, setSearchQuery }) => {
  useLocation();

  const [jobs, setJobs] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [locationCounts, setLocationCounts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [sidebarFilters, setSidebarFilters] = useState({
    experience: 0,
    skills: [],
    location: [],
    role: [],
    workMode: []
  });

  // Derived Filter Options (Unique values from jobs)
  const [filterOptions, setFilterOptions] = useState({
    experiences: [],
    skills: [],
    locations: [],
    roles: [],
    workModes: ["Remote", "Hybrid", "Work From Office"] // Fixed options
  });

  // Calculate options when jobs change
  useEffect(() => {
    if (!jobs.length) return;
    const exps = [...new Set(jobs.map(j => j.Experience).filter(Boolean))];

    // Fixed locations as requested
    const fixedLocations = ["Hyderabad", "Chennai", "Bangalore", "Pune", "Mumbai"];
    const unwanted = ["hyd", "hyd/che", "remote/hyd", "hyd/chennai"]; // User requested removal
    const derivedLocs = jobs.map(j => j.Location)
      .filter(Boolean)
      .filter(l => !unwanted.includes(l.toLowerCase()));

    const locs = [...new Set([...fixedLocations, ...derivedLocs])].filter(Boolean).sort();

    const roles = [...new Set(jobs.map(j => j.JobTitle).filter(Boolean))]; // Using JobTitle as Role/Dept

    // Skills might be CSV string or array
    const allSkills = jobs.flatMap(j => {
      const s = j.Skills;
      if (Array.isArray(s)) return s;
      if (typeof s === 'string') return s.split(',').map(sk => sk.trim());
      return [];
    }).filter(Boolean);
    const uniqueSkills = [...new Set(allSkills)];

    setFilterOptions({
      experiences: exps.sort(),
      skills: uniqueSkills.sort(),
      locations: locs.sort(),
      roles: roles.sort(),
      workModes: ["Remote", "Hybrid", "Work From Office"]
    });
  }, [jobs]);


  // Filter Jobs
  useEffect(() => {
    if (!jobs.length) return;

    let result = jobs;

    // 0. Sidebar Filters
    if (sidebarFilters.experience !== undefined) { // Check for existence (0 is falsy)
      if (typeof sidebarFilters.experience === 'number') {
        const minExp = sidebarFilters.experience;
        result = result.filter(job => {
          const expStr = (job.Experience || "").toString();
          const match = expStr.match(/(\d+)/); // Extract first number "3-5" -> 3
          const jobMin = match ? parseInt(match[1] || match[0], 10) : 0;
          return jobMin >= minExp;
        });
      } else if (Array.isArray(sidebarFilters.experience) && sidebarFilters.experience.length > 0) {
        result = result.filter(job => sidebarFilters.experience.includes(job.Experience));
      }
    }
    if (sidebarFilters.location.length > 0) {
      result = result.filter(job => sidebarFilters.location.some(selectedLoc => {
        const jobLoc = (job.Location || "").toLowerCase();
        const filter = selectedLoc.toLowerCase();

        if (jobLoc.includes(filter)) return true;

        // Aliases logic
        if (filter === "hyderabad" && jobLoc.includes("hyd")) return true;
        if (filter === "bangalore" && (jobLoc.includes("bengaluru") || jobLoc.includes("bnglr"))) return true;
        if (filter === "chennai" && jobLoc.includes("che")) return true;

        return false;
      }));
    }

    if (sidebarFilters.workMode && sidebarFilters.workMode.length > 0) {
      result = result.filter(job => sidebarFilters.workMode.some(mode => {
        const loc = (job.Location || "").toLowerCase();
        if (mode === "Remote") return loc.includes("remote");
        if (mode === "Hybrid") return loc.includes("hybrid");
        if (mode === "Work From Office") return !loc.includes("remote") && !loc.includes("hybrid");
        return false;
      }));
    }

    if (sidebarFilters.role.length > 0) {
      result = result.filter(job => sidebarFilters.role.includes(job.JobTitle));
    }
    if (sidebarFilters.skills.length > 0) {
      result = result.filter(job => {
        const jobSkills = typeof job.Skills === 'string' ? job.Skills.split(',').map(s => s.trim()) : (job.Skills || []);
        return sidebarFilters.skills.some(s => jobSkills.includes(s));
      });
    }

    // 1. KPI Card Location Filter (Overrides/Intersects)
    if (selectedLocation) {
      const filterLoc = selectedLocation.toLowerCase();
      result = result.filter((job) => {
        const locs = job.Location?.toLowerCase().split("/").map((l) => l.trim());
        if (locs?.includes(filterLoc)) return true;
        if (filterLoc === "hyderabad" && locs?.includes("hyd")) return true;
        return false;
      });
    }

    // 2. Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job =>
        job.JobTitle?.toLowerCase().includes(query) ||
        job.Skills?.toString().toLowerCase().includes(query) ||
        job.Location?.toLowerCase().includes(query) ||
        job.JobId?.toLowerCase().includes(query)
      );
    }

    setFilteredData(result);
  }, [searchQuery, jobs, selectedLocation, sidebarFilters]);

  // User State
  const [user, setUser] = useState({ id: "", name: "" });
  const [referrals, setReferrals] = useState([]);

  const [previewUpload, setPreviewUpload] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadError, setUploadError] = useState(null);

  // Initialize User
  useEffect(() => {
    const userId = localStorage.getItem("userId") || "";
    const userName = localStorage.getItem("userName") || "";

    let displayId = userId;
    if (userId.includes("@")) {
      displayId = userId.split("@")[0];
    }
    // Fallback if empty
    if (!displayId) displayId = "EMP-001";

    setUser({ id: userId, email: userId, displayId: displayId.toUpperCase(), name: userName });
  }, []);

  // Fetch Jobs
  useEffect(() => {
    const startTime = Date.now();
    fetch("https://9x0xuswztb.execute-api.us-east-1.amazonaws.com/prod/jobs")
      .then((res) => res.json())
      .then((result) => {
        const items = result?.jobs || [];
        setJobs(items);
        setFilteredData(items);

        // Location counts
        const counts = {};
        items.forEach((job) => {
          const locString = job.Location || "";
          const locList = locString.split("/").map((l) => l.trim());
          locList.forEach((loc) => {
            if (loc) {
              let normalization = loc;
              const lowerLoc = normalization.toLowerCase();

              if (lowerLoc === "hyd") {
                normalization = "Hyderabad";
              } else if (lowerLoc === "bangalore" || lowerLoc === "bengaluru" || lowerLoc === "Bnglr") {
                normalization = "Bangalore";
              }
              counts[normalization] = (counts[normalization] || 0) + 1;
            }
          });
        });

        if (counts["Bangalore"] === undefined) {
          counts["Bangalore"] = 0;
        }

        const customOrder = ["Hyderabad", "Chennai", "Remote", "Bangalore"];

        const locationsArray = Object.entries(counts).map(([location, count]) => ({
          location,
          count,
        })).sort((a, b) => {
          const idxA = customOrder.indexOf(a.location);
          const idxB = customOrder.indexOf(b.location);
          // If both found in custom order, sort by index
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          // If only A found, A comes first
          if (idxA !== -1) return -1;
          // If only B found, B comes first
          if (idxB !== -1) return 1;
          // Otherwise sort alphabetically
          return a.location.localeCompare(b.location);
        });

        setLocationCounts(locationsArray);

        const elapsedTime = Date.now() - startTime;
        const minTime = 8000;
        const remainingTime = minTime - elapsedTime;

        if (remainingTime > 0) {
          setTimeout(() => setIsLoading(false), remainingTime);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("FETCH ERROR:", err);
        const elapsedTime = Date.now() - startTime;
        const minTime = 20000;
        const remainingTime = minTime - elapsedTime;
        if (remainingTime > 0) {
          setTimeout(() => setIsLoading(false), remainingTime);
        } else {
          setIsLoading(false);
        }
      });
  }, []);

  // Fetch Referrals (Merge API + Local)
  useEffect(() => {
    if (!user.id) return;

    // 1. Load Local Referrals Immediately
    const storageKey = user.id ? `my_referrals_${user.id}` : "my_referrals_local";
    const localRefs = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setReferrals(localRefs); // Show local immediately

    // 2. Fetch API Referrals
    fetch(
      `https://nqe3spdmwa.execute-api.us-east-1.amazonaws.com/referrals?employeeId=${user.email}`
    )
      .then((res) => res.json())
      .then((result) => {
        const apiReferrals = result?.referrals || [];
        const combined = [...localRefs, ...apiReferrals];
        setReferrals(combined);
      })
      .catch((err) => {
        console.log("REFERRALS ERROR:", err);
        // On error, we still have localRefs set
      });
  }, [user.id]);

  const handleFileSelect = (job, file, error) => {
    if (error) {
      setUploadError(error);
      setPreviewUpload(null);
      setShowSuccess(false);
    } else {
      // Validate File Type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];

      const validExtensions = [".pdf", ".doc", ".docx"];
      const fileExtension = file?.name ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";

      if (file && !validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        setUploadError("Please upload the pdf,doc,docx file");
        setPreviewUpload(null);
        return;
      }
      setPreviewUpload({ job, file });
      setShowSuccess(false);
      setUploadError(null);
    }
  };

  /* ---------------- SUBMIT APPLICATION (User Snippet) ---------------- */
  const formatCandidateName = (filename) => {
    if (!filename) return "";
    let name = filename;
    name = name.replace(/\.(pdf|docx|doc)$/i, "");
    name = name.replace(/[_-]/g, " ");
    name = name.replace(/\b(resume|cv)\b/gi, "");
    name = name.replace(/\s+/g, " ").trim();
    return name.replace(/\b\w/g, c => c.toUpperCase());
  };

  const submitApplication = async () => {
    const file = previewUpload?.file;

    if (!file) {
      alert("Please select a resume");
      return;
    }

    try {
      setIsSubmitting(true);
      // 1. Get Presigned URL
      const payload = {
        filename: file.name,
        fileType: file.type,
        jobId: previewUpload?.job?.JobId,
        referredBy: user?.email,
        candidateName: formatCandidateName(file.name),
        candidateEmail: ""
      };


      console.log("Submitting payload:", payload);

      const res = await fetch(
        "https://nqe3spdmwa.execute-api.us-east-1.amazonaws.com/presign-referral-upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", res.status, errorText);
        throw new Error(`Presigned URL failed: ${errorText}`);
      }

      const { presignedUrl } = await res.json();
      console.log("Got Presigned URL:", presignedUrl);

      // 2. Upload to S3
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          "x-amz-meta-jobid": previewUpload?.job?.JobId,
          "x-amz-meta-referredby": user?.email
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      // 3. SUCCESS - Update Local State & Storage
      const newReferral = {
        CandidateName: formatCandidateName(file.name), // Format the name
        CandidateEmail: "", // No email
        JobTitle: previewUpload?.job?.JobTitle,
        JobId: previewUpload?.job?.JobId,
        Status: "Pending",
        Date: new Date().toISOString()
      };

      // Save to Local Storage (User Specific)
      const storageKey = user.id ? `my_referrals_${user.id}` : "my_referrals_local";
      const currentLocal = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const updatedLocal = [newReferral, ...currentLocal];
      localStorage.setItem(storageKey, JSON.stringify(updatedLocal));

      // Update UI State
      setReferrals(prev => [newReferral, ...prev]);

      setShowSuccess(true);
      setIsSubmitting(false); // Clean up state though component might unmount/change view
    } catch (err) {
      console.error(err);
      setUploadError(err.message);
      setIsSubmitting(false);
    }
  };


  const closeOverlay = () => {
    setPreviewUpload(null);
    setShowSuccess(false);
    setUploadError(null);
  };

  // Helper for dynamic colors for Glass Pin
  // Now using a TRANSPARENT 3D Icon, so no blend mode needed
  // Helper for dynamic icons
  const getLocationIcon = (location) => {
    const loc = location.toLowerCase();

    // User requested specific "Place Marker" icon for Hyderabad
    if (loc.includes("hyd")) return require("./assets/charminar.png");
    if (loc.includes("chennai")) return require("./assets/chennai.png");
    if (loc.includes("bangalore")) return require("./assets/bengaluru.png"); // Custom Icon
    if (loc.includes("pune")) return "https://img.icons8.com/3d-fluency/188/graduation-cap.png"; // Education
    if (loc.includes("mumbai")) return "https://img.icons8.com/3d-fluency/188/movie-projector.png"; // Bollywood
    if (loc.includes("delhi")) return "https://img.icons8.com/3d-fluency/188/museum.png"; // Monument
    if (loc.includes("remote")) return require("./assets/remote.png"); // Remote work

    // Fallback
    return "https://img.icons8.com/3d-fluency/188/map-marker.png";
  };

  const getPinStyle = (location) => {
    const style = {
      transition: "0.3s",
      filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))",
    };

    // Increase size for Hyderabad as requested
    if (location && location.toLowerCase().includes("hyd")) {
      style.transform = "scale(2.5)"; // Significant increase
      style.mixBlendMode = "multiply";
    }
    // Increase size for Chennai as requested
    if (location && location.toLowerCase().includes("chennai")) {
      style.transform = "scale(2.5)";
      style.mixBlendMode = "multiply"; // Remove white background
    }
    // Increase size for Bangalore as requested
    if (location && location.toLowerCase().includes("bangalore")) {
      style.transform = "scale(2.5)";
      style.mixBlendMode = "multiply";
    }
    // Increase size for Remote as requested
    if (location && location.toLowerCase().includes("remote")) {
      style.transform = "scale(2.0 , 3.0)";
    }

    return style;
  };

  return (
    <div className="jobs-layout">


      {/* FULL PAGE OVERLAY MODAL */}
      {previewUpload && (
        <div className="fullPageOverlay"><div className="fullPageModal">
          {/* Close Button - Direct Child for Corner Pos (Visible in both states) */}
          <button className="fullPageCloseBtn" onClick={closeOverlay}>✕</button>

          {!showSuccess ? (
            <>

              {/* Header Row */}
              <div className="modal-header-row"><h2>Confirm Application</h2></div>

              <div className="modalContentGrid">
                <div className="modalField"><label>Job Title</label><div className="fieldValue">{previewUpload.job.JobTitle}</div></div>
                <div className="modalField"><label>Job ID</label><div className="fieldValue">{previewUpload.job.JobId}</div></div>
                <div className="modalField"><label>Location</label><div className="fieldValue">{previewUpload.job.Location}</div></div>
                <div className="modalField"><label>Experience</label><div className="fieldValue">{previewUpload.job.Experience}</div></div>

                {/* Inputs removed as per request. Using Resume Filename automatically. */}


                <div className="modalField fullWidth"><label>Selected Resume</label><div className="fieldValue highlight">📄 {previewUpload.file.name}</div></div>
              </div>

              <div className="modalActions">
                <button className="cancelActionBtn" onClick={closeOverlay}>
                  Cancel
                </button>

                <button
                  className={`submitActionBtn ${isSubmitting ? 'disabled' : ''}`}
                  onClick={submitApplication}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="bubble-loader">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    "Confirm & Submit"
                  )}
                </button></div></>
          ) : (
            <div className="successView"><div className="successIcon">✅</div><h2>Application Submitted for {previewUpload.job.JobTitle}!</h2>
              {/* No bottom close button */}
            </div>
          )}
        </div></div>
      )
      }

      {/* ERROR MODAL */}
      {uploadError && (
        <div className="fullPageOverlay">
          <div className="fullPageModal errorModal">
            <button className="fullPageCloseBtn" onClick={closeOverlay}>✕</button>
            <div className="errorIcon">⚠️</div>
            <h3 style={{ color: "#d32f2f", margin: 0 }}>Upload Error</h3>
            <p style={{ marginTop: "15px", color: "#333", fontWeight: "600", fontSize: "1.1rem" }}>{uploadError}</p>
            <button className="cancelActionBtn" style={{ marginTop: "25px", width: "100%" }} onClick={closeOverlay}>
              Close
            </button>
          </div>
        </div>
      )}

      <Sidebar
        user={user}
        referrals={referrals}
        locationCounts={locationCounts}
        isOpen={true}
        filters={sidebarFilters}
        setFilters={setSidebarFilters}
        options={filterOptions}
      />
      <div className="jobsPageContainer">
        <Header user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} referrals={referrals} />

        {isLoading ? (
          <div style={{
            height: "calc(100vh - 100px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}>
            {/* Loader Container */}
            <div style={{
              position: "relative",
              width: "60px",
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              {/* Rotating Outer Ring */}
              <div style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "3px solid #f3f3f3",
                borderTop: "3px solid #007bff",
                animation: "spin 1s linear infinite"
              }}></div>

              {/* Static Logo */}
              <img
                src={require("./assets/Logo.png")}
                alt="Loading..."
                style={{
                  width: "30px", // Smaller to fit inside ring
                  height: "30px",
                  objectFit: "contain"
                }}
              />

            </div>

            <style>
              {`
            @keyframes spin {
        0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
      }
        `}
            </style>
          </div>
        ) : (
          <>
            {/* LOCATION CARDS */}
            <div className="locationsGrid">
              {locationCounts.map((loc, index) => {
                const themes = ["theme-blue", "theme-purple", "theme-emerald", "theme-orange", "theme-red", "theme-cyan"];
                const themeClass = themes[index % themes.length];
                return (
                  <div
                    className={`locationCard ${themeClass} ${selectedLocation === loc.location ? "active-floating" : ""}`}
                    key={index}
                    onClick={() => {
                      // Toggle Logic
                      if (selectedLocation === loc.location) {
                        setSelectedLocation(null);
                        setFilteredData(jobs); // Reset to all
                      } else {
                        setSelectedLocation(loc.location);
                        const filtered = jobs.filter((job) => {
                          const locs = job.Location?.toLowerCase().split("/").map((l) => l.trim());
                          const filterLoc = loc.location.toLowerCase();

                          if (locs?.includes(filterLoc)) return true;
                          if (filterLoc === "hyderabad" && locs?.includes("hyd")) return true;

                          return false;
                        });
                        setFilteredData(filtered);
                      }
                    }}
                  ><div className="locationCardContent"><div className="kpi-card-header"><h4>{loc.location}</h4><img
                    src={getLocationIcon(loc.location)}
                    alt={`${loc.location} Icon`}
                    className="locationIcon"
                    style={getPinStyle(loc.location)}
                  /></div><div className="kpi-card-body"><div className="kpi-number"><CountUp
                    key={selectedLocation}
                    start={0}
                    end={loc.count}
                    duration={6}
                    separator=","
                    className="kpi-value"
                  /></div><p className="kpi-label">
                          {loc.location.toLowerCase().includes("remote") ? "New Opening" : "New Openings"}
                        </p></div></div></div>
                );
              })}
            </div>

            {/* ACTIVE JOB OPENINGS */}
            {filteredData.length > 0 && (
              <h3 className="resultsCount">
                Active Job Openings ({filteredData.length})
              </h3>
            )}

            {/* JOB CARDS */}
            <div className="jobsGrid">
              {filteredData.map((job, index) => {
                const themes = ["theme-blue", "theme-purple", "theme-emerald", "theme-orange", "theme-red", "theme-cyan"];
                const themeClass = themes[index % themes.length];

                // Format Location for Display
                let displayLoc = job.Location;
                if (displayLoc?.toLowerCase().includes("chennai")) {
                  displayLoc = displayLoc.replace(/Chennai/i, "che");
                }
                if (displayLoc?.toLowerCase().includes("hyderabad")) {
                  displayLoc = displayLoc.replace(/Hyderabad/i, "hyd");
                }

                return (
                  <div className={`jobCard ${themeClass} `} key={index}>
                    <div className="jobCardHeader">
                      <div>
                        <h2 className="jobTitle" style={{ marginBottom: "5px" }}>{job.JobTitle}</h2>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <p className="jobLocation" style={{ margin: 0 }}>{displayLoc}</p>
                          <p className="jobId" style={{ margin: 0 }}>Job ID: {job.JobId}</p>
                        </div>
                      </div>
                      <div style={{ alignSelf: "flex-start" }}>
                        {/* ✅ Pass handleFileSelect to JobCard */}
                        <JobCard
                          job={job}
                          onFileSelect={handleFileSelect}
                          isReferred={referrals.some(r => r.JobId === job.JobId)}
                        />
                      </div>
                    </div>
                    <p className="jobDescription">Experience: <strong>{job.Experience}</strong></p>
                    <p className="jobDescription">
                      <strong>Skills:</strong> {Array.isArray(job.Skills) ? job.Skills.join(", ") : job.Skills}
                    </p>
                    <p className="jobDescription"><strong>Hiring Manager:</strong> {job.HiringManager}</p>

                    <div style={{ marginTop: "auto", paddingTop: "15px", width: "100%", textAlign: "right", minHeight: "20px" }}>
                      {/* Reserved space for footer message to keep cards equal size/alignment */}
                      <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#16a34a" }}>
                        {referrals.some(r => r.JobId === job.JobId) ? "You are referred for this position" : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <ChatWidget />
    </div>
  );
};

export default JobsResultPage;