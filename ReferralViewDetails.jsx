import React, { useState } from 'react';
import './JobsResultPage.css'; // Re-use existing styles

const ReferralDetailsView = ({ referral, onBack }) => {
    const [bonusClaimed, setBonusClaimed] = useState(false);

    if (!referral) return null;

    // Generate specific fields if missing
    const referralId = referral.ReferralId || `REF-${Math.floor(Math.random() * 10000)}`;
    const submissionDate = referral.Date ? new Date(referral.Date).toLocaleString() : "N/A";

    // Determine if bonus is claimable (e.g., only if Hired)
    const canClaimBonus = referral.Status === "Hired" && !bonusClaimed;

    return (
        <div className="referral-details-container" style={{ padding: '5px', background: 'white', borderRadius: '8px', position: 'relative' }}>
            {/* Header */}
            <div className="details-header" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Candidate Profile</h2>
            </div>

            {/* Requested Form Fields */}
            <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>

                {/* Candidate Name */}
                <div className="field-group">
                    <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Candidate Name</label>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{referral.CandidateName}</div>
                </div>

                {/* Referral ID */}
                <div className="field-group">
                    <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Referral ID</label>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#4f46e5' }}>{referralId}</div>
                </div>

                {/* Job Title */}
                <div className="field-group">
                    <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Job Title</label>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{referral.JobTitle}</div>
                </div>

                {/* Job ID */}
                <div className="field-group">
                    <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Job ID</label>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{referral.JobId}</div>
                </div>

                {/* Submission Date */}
                <div className="field-group">
                    <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Date and Time of Submission</label>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{submissionDate}</div>
                </div>

                {/* Status */}
                <div className="field-group">
                    <label style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Status of Referral</label>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        background: referral.Status === 'Hired' ? '#dcfce7' : '#f1f5f9',
                        color: referral.Status === 'Hired' ? '#166534' : '#475569'
                    }}>
                        {referral.Status || "Pending"}
                    </div>
                </div>

            </div>

            {/* Claim Bonus Section */}
            <div className="bonus-section" style={{ borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => setBonusClaimed(true)}
                    disabled={!canClaimBonus}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        background: canClaimBonus ? '#4f46e5' : '#e2e8f0',
                        color: canClaimBonus ? 'white' : '#94a3b8',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: canClaimBonus ? 'pointer' : 'not-allowed',
                        boxShadow: canClaimBonus ? '0 4px 6px rgba(79, 70, 229, 0.2)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    {bonusClaimed ? "Bonus Claimed ✅" : "Claim Referral Bonus"}
                </button>
                {!canClaimBonus && !bonusClaimed && (
                    <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#999' }}>
                        Bonus available only when status is 'Hired'.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ReferralDetailsView;
