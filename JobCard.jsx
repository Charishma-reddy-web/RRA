import React from "react";
import "./JobCard.css";

function JobCard({ job, onFileSelect, isReferred }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Pass file to parent for validation
    if (onFileSelect) onFileSelect(job, file, null);
    e.target.value = null;
  };

  return (
    <>
      {/* Note: The header structure is usually handled in parent,
           but JobCard logic is here. We just render the button. */}
      {/* Always render the functional Refer button */}
      <label className="uploadBtn">
        Refer
        <input
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          hidden
          onChange={handleFileChange}
        />
      </label>
    </>
  );
}

export default JobCard;
