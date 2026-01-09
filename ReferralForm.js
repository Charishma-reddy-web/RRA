import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReferralForm.css";

const ReferralForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const job = state?.job || null;

  const [resumeFile, setResumeFile] = useState(null);
  const [candidateDesc, setCandidateDesc] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef(null);

  // If job object didn't come → show friendly error
  if (!job) {
    return (
      <div className="refer-container">
        <div className="refer-card">
          <h2 className="error">
            ❌ No job data received. Go back and select a job again.
          </h2>
          <button className="submit-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      setErrorMsg("Only PDF,Image, DOCX allowed.");
      return;
    }

    setResumeFile(file);
    setErrorMsg("");
  };

  const handleSend = async () => {
    if (!resumeFile) {
      setErrorMsg("Please upload a resume.");
      return;
    }

    const formData = new FormData();
    // Ensure field names match the backend expectation
    formData.append("jobId", job.JobId || job.id || "");
    formData.append("jobTitle", job.JobTitle || job.title || "");
    // formData.append("candidateDescription", candidateDesc); // Backend might not accept this if strict, but keeping it is usually fine.
    formData.append("resume", resumeFile);

    try {
      const response = await fetch("https://nqe3spdmwa.execute-api.us-east-1.amazonaws.com/presign-referral-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // await response.json(); // Don't parse if not JSON or if 204

      setSuccessMsg("Referral submitted successfully!");
      setErrorMsg("");
      setResumeFile(null);
      setCandidateDesc("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Referral Error:", error);
      setErrorMsg("Failed to send referral. Please try again.");
    }
  };

  return (
    <div className="refer-container">
      <div className="refer-card">
        <h1 className="referral-title">Start Referring</h1>
        <h2 className="job-title">{job.title}</h2>
        <p className="job-desc">{job.description}</p>

        <div className="upload-box">
          <button
            className="upload-btn"
            onClick={() => fileInputRef.current.click()}
          >
            {resumeFile ? resumeFile.name : "Upload Resume"}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".pdf,.docx"
            onChange={handleResumeUpload}
          />
        </div>

        <textarea
          className="text-area"
          placeholder="Write about the candidate (optional)"
          value={candidateDesc}
          onChange={(e) => setCandidateDesc(e.target.value)}
        />

        {errorMsg && <p className="error">{errorMsg}</p>}
        {successMsg && <p className="success">{successMsg}</p>}

        <button className="submit-btn" onClick={handleSend}>
          Submit Referral
        </button>
      </div>
    </div>
  );
};

export default ReferralForm;
