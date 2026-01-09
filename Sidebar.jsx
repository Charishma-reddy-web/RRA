import React from "react";
import "./Sidebar.css";

const Sidebar = ({ user = {}, isOpen = false, filters, setFilters, options }) => {

    // State for collapsible sections
    const [expanded, setExpanded] = React.useState({
        experience: false,
        workMode: false,
        role: false,
        location: false,
        skills: false
    });

    const toggleSection = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleFilterChange = (category, value) => {
        const current = filters[category];
        const newValues = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];

        setFilters({ ...filters, [category]: newValues });
    };

    const categories = [
        { id: 'experience', label: 'Experience' },
        { id: 'workMode', label: 'Work Mode' },
        { id: 'role', label: 'Technical Roles' },
        { id: 'location', label: 'Location' },
        { id: 'skills', label: 'Skills' }
    ];

    return (
        <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>

            {/* 1. BRAND HEADER - Removed as per user request */}
            <div style={{ marginTop: '20px' }}></div>



            {/* 3. FILTERS SECTION */}
            <div className="activity-section">
                <h4 className="section-title" style={{ marginBottom: '20px' }}>Filter Results</h4>

                <div className="activity-feed"> {/* Reusing scrollable container */}
                    {categories.map(cat => {
                        const isExpanded = expanded[cat.id];

                        // Header for Dropdown
                        const renderHeader = (label, extra = null) => (
                            <div
                                onClick={() => toggleSection(cat.id)}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    marginBottom: '10px',
                                    padding: '8px 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <h5 style={{ color: '#93c5fd', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>
                                    {label}
                                </h5>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {extra}
                                    <span style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
                                        {isExpanded ? '▲' : '▼'}
                                    </span>
                                </div>
                            </div>
                        );

                        // Special Case: Experience Slider
                        if (cat.id === 'experience') {
                            return (
                                <div key={cat.id} className="filter-group" style={{ marginBottom: '15px' }}>
                                    {renderHeader(cat.label, <span style={{ color: '#fff', fontSize: '0.8rem' }}>{filters.experience > 0 ? `${filters.experience}+ Yrs` : ""}</span>)}

                                    {isExpanded && (
                                        <div style={{ padding: '0 5px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '0.75rem', marginBottom: '5px' }}>
                                                <span>Any</span>
                                                <span>30 Yrs</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="30"
                                                value={filters.experience !== undefined ? filters.experience : 0}
                                                onChange={(e) => setFilters({ ...filters, experience: parseInt(e.target.value) })}
                                                style={{ width: '100%', accentColor: '#2563eb', cursor: 'grab' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        const opts = options?.[cat.id] || options?.[cat.id + 's'] || []; // Support both 'skills' and 'experiences' naming conventions


                        return (
                            <div key={cat.id} className="filter-group" style={{ marginBottom: '15px' }}>
                                {renderHeader(cat.label, filters[cat.id]?.length > 0 ? <span style={{ color: '#fff', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{filters[cat.id]?.length}</span> : null)}

                                {isExpanded && (
                                    <div style={{ paddingLeft: '5px', maxHeight: '200px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                                        {opts.map((opt, idx) => (
                                            <label key={idx} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#e2e8f0' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={filters[cat.id]?.includes(opt)}
                                                    onChange={() => handleFilterChange(cat.id, opt)}
                                                    style={{ accentColor: '#2563eb' }}
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 4. FOOTER */}
            {/* <div className="sidebar-footer">
                <button className="logout-btn">Log Out</button>
            </div> */}

        </div >
    );
};

export default Sidebar;
