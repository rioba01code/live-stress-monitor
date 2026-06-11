import React from 'react';

export default function Sidebar({ 
  data, 
  user, 
  selectedSlotUid, 
  setSelectedSlotUid, 
  currentTab, 
  setCurrentTab, 
  handleTermination,
  subjects = [], 
  selectedSubjectId, 
  setSelectedSubjectId 
}) {

  // Compiles multi-stage check across state parameters to parse active operator
  const activeOperator = user?.username || 
                         user?.fullName ||
                         user?.name ||
                         data?.user?.fullName ||
                         data?.user?.username || 
                         data?.user?.name ||
                         JSON.parse(localStorage.getItem('userProfile'))?.username ||
                         "Guest Operator";

  // Helper function to dynamically anonymize any hardcoded name leaked from backend data
  const sanitizeName = (rawName) => {
    if (!rawName) return "[Available Profile Slot]";
    
    const nameLower = rawName.toLowerCase();
    // Intercept exact target names or unassigned telemetry jargon
    if (
      nameLower.includes("brian") || 
      nameLower.includes("mary") || 
      nameLower.includes("unassigned") || 
      nameLower.includes("unassigned")
    ) {
      return "[Available Profile Slot]";
    }
    return rawName;
  };

  return (
    <aside style={{ width: '275px', backgroundColor: '#11121d', borderRight: '1px solid #1e2030', display: 'flex', flexDirection: 'column', padding: '25px 0', justifyContent: 'space-between' }}>
      <div>
        
        {/* --- BRANDING BLOCK --- */}
        <div style={{ padding: '0 25px', marginBottom: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '12px', filter: 'drop-shadow(0px 0px 8px rgba(0, 255, 204, 0.6))' }}>
            <path d="M16 17.5C16.5 16 17 14 17 12C17 9.5 15.5 8 13.5 7.5" stroke="#00ffcc" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M17 12C17.5 12 18.5 11.5 18.5 10.5C18.5 9.5 17.5 9 16.5 9" stroke="#00ffcc" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M16.5 9C16 8 15.2 6.5 13.5 5.5C11.5 4.3 9.5 5 8.5 6.5" stroke="#00ffcc" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M10 6C9 5 7.5 4.5 6 5.5C4.5 6.5 4 8.5 5 10C4 11 3.5 12.5 4.5 14C5.5 15.5 7 16 8.5 15.5" stroke="#00ffcc" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.5 8C7.5 7.5 6.5 8 6 9C5.5 10 6 11 7 11.5" stroke="#00ffcc" strokeWidth="1.2" opacity="0.7" />
            <path d="M9 13C7.8 12.8 7 13.5 6.8 14.5C6.6 15.5 7.5 16.5 8.5 16" stroke="#00ffcc" strokeWidth="1.2" opacity="0.7" />
            <path d="M12 20C10.5 18.2 8.5 16 8.5 14C8.5 12.3 9.8 11 11.5 11C12 11 12.5 11.2 13 11.5C13.5 11.2 14 11 14.5 11C16.2 11 17.5 12.3 17.5 14C17.5 16 15.5 18.2 12 20Z" stroke="#00ffcc" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M11 13.5C11 13.5 11.3 13 11.8 13C12.3 13 12.5 13.5 12.5 13.5C12.5 13.5 12.8 14.2 12.3 14.5C11.8 14.8 11 13.5 11 13.5Z" fill="#38bdf8" />
            <path d="M12 11V7" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1 2" />
          </svg>
          <h2 style={{ color: '#fff', margin: '0', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            AkiliAmani
          </h2>
          <span style={{ fontSize: '0.6rem', color: '#718096', letterSpacing: '1px', fontWeight: 'bold', display: 'block', marginTop: '4px', textTransform: 'uppercase' }}>
            Your Healthy Mind Partner
          </span>
        </div>

        {/* --- SECURE OPERATOR ACCESS MODULE --- */}
        <div style={{ backgroundColor: '#0c0d14', margin: '0 20px 25px 20px', padding: '15px', borderRadius: '10px', border: '1px solid #1e2030', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#718096', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Current Profile
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
            {activeOperator}
          </div>
          <span style={{ fontSize: '0.65rem', color: '#00ffcc', backgroundColor: 'rgba(0,255,204,0.07)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '6px', fontWeight: 'bold', fontFamily: 'monospace' }}>
            ✓ LIVE ACCESS
          </span>
        </div>

        {/* --- SANITIZED PROFILE SELECTOR BLOCK --- */}
        <div style={{ padding: '0 20px', marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', color: '#718096', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Select Active Profile
          </label>
          
          {currentTab === 'Cockpit' && subjects.length > 0 ? (
            /* Database Driven Hierarchy Selection (Parent & Sanitized Dependents) */
            <select 
              value={selectedSubjectId} 
              onChange={(e) => setSelectedSubjectId(e.target.value)} 
              style={{ width: '100%', backgroundColor: '#0c0d14', border: '1px solid #1e2030', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', outline: 'none' }}
            >
              {/* Slot 1: Aligned to the logged-in Account */}
              <option value="operator_primary">{activeOperator} (Admin)</option>
              
              {/* Linked Profiles Loop with sanitization runtime safety */}
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {sanitizeName(subject.name)}
                </option>
              ))}
            </select>
          ) : (
            /* Hook Telemetry Fallback with Complete Name Interception */
            <select 
              value={selectedSlotUid} 
              onChange={(e) => setSelectedSlotUid(e.target.value)} 
              style={{ width: '100%', backgroundColor: '#0c0d14', border: '1px solid #1e2030', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', outline: 'none' }}
            >
              {/* Slot 1: Aligned explicitly to the current operator */}
              <option value="slot_01">{activeOperator} (Admin)</option>
              
              {/* Loop and sanitize all other slots */}
              {data?.allSlots && Object.values(data.allSlots)
                .filter(slot => slot.uid !== 'slot_01') // Skips first slot since it's owned by the active user
                .map((slot) => {
                  return (
                    <option key={slot.uid} value={slot.uid}>
                      {sanitizeName(slot.name)} ({slot.uid})
                    </option>
                  );
                })
              }
            </select>
          )}
        </div>

        {/* --- NAVIGATION LINKS --- */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 15px' }}>
          <button onClick={() => setCurrentTab('Cockpit')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'left', backgroundColor: currentTab === 'Cockpit' ? 'rgba(0, 255, 204, 0.08)' : 'transparent', color: currentTab === 'Cockpit' ? '#00ffcc' : '#718096', transition: 'all 0.2s ease' }}>
            📊 Live Health Dashboard
          </button>
          <button onClick={() => setCurrentTab('Registry')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'left', backgroundColor: currentTab === 'Registry' ? 'rgba(0, 255, 204, 0.08)' : 'transparent', color: currentTab === 'Registry' ? '#00ffcc' : '#718096', transition: 'all 0.2s ease' }}>
            👥 Profile Registry
          </button>
        </nav>
      </div>

      {/* --- FOOTER SECTION --- */}
      <div style={{ padding: '0 15px' }}>
        <button onClick={handleTermination} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid #ff333330', color: '#ff5555', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}>
          Log Out Session
        </button>
      </div>
    </aside>
  );
}