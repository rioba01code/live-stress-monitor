import React from 'react';

export default function Sidebar({ data, selectedSlotUid, setSelectedSlotUid, currentTab, setCurrentTab, handleTermination }) {
  return (
    <aside style={{ width: '275px', backgroundColor: '#11121d', borderRight: '1px solid #1e2030', display: 'flex', flexDirection: 'column', padding: '25px 0', justifyContent: 'space-between' }}>
      <div>
        <div style={{ padding: '0 25px', marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', margin: '0', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>🏛️ NeuroCity AI</h2>
          <span style={{ fontSize: '0.6rem', color: '#718096', letterSpacing: '1px', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>BIOMEDICAL ENGINEERING SYSTEM</span>
        </div>

        <div style={{ backgroundColor: '#0c0d14', margin: '0 20px 25px 20px', padding: '15px', borderRadius: '10px', border: '1px solid #1e2030', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#718096', fontWeight: 'bold', textTransform: 'uppercase' }}>STATION CONTROLLER</div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>Luxiouske</div>
          <span style={{ fontSize: '0.65rem', color: '#00ffcc', backgroundColor: 'rgba(0,255,204,0.07)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '6px', fontWeight: 'bold', fontFamily: 'monospace' }}>VERIFIED_LAB_PROVISIONAL</span>
        </div>

        <div style={{ padding: '0 20px', marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', color: '#718096', fontWeight: 'bold', marginBottom: '8px' }}>TUNED SYSTEM HARDWARE SLOT</label>
          <select value={selectedSlotUid} onChange={(e) => setSelectedSlotUid(e.target.value)} style={{ width: '100%', backgroundColor: '#0c0d14', border: '1px solid #1e2030', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {data?.allSlots && Object.values(data.allSlots).map((slot) => (
              <option key={slot.uid} value={slot.uid}>{slot.name} ({slot.uid})</option>
            ))}
          </select>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 15px' }}>
          <button onClick={() => setCurrentTab('Cockpit')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'left', backgroundColor: currentTab === 'Cockpit' ? 'rgba(0, 255, 204, 0.08)' : 'transparent', color: currentTab === 'Cockpit' ? '#00ffcc' : '#718096' }}>
            📊 Biomedical Cockpit
          </button>
          <button onClick={() => setCurrentTab('Registry')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'left', backgroundColor: currentTab === 'Registry' ? 'rgba(0, 255, 204, 0.08)' : 'transparent', color: currentTab === 'Registry' ? '#00ffcc' : '#718096' }}>
            👥 Patient Registry
          </button>
        </nav>
      </div>

      <div style={{ padding: '0 15px' }}>
        <button onClick={handleTermination} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid #ff333330', color: '#ff5555', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
          Disconnect Terminal Session
        </button>
      </div>
    </aside>
  );
}