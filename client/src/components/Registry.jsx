import React, { useState } from 'react';
import { api } from '../services/api';

export default function Registry({ authToken, dynamicAccent }) {
  const [formSlot, setFormSlot] = useState('slot_01');
  const [formName, setFormName] = useState('');
  const [formZone, setFormZone] = useState('');
  const [formThreshold, setFormThreshold] = useState(0.60);

  const handleUpdateSlot = async (e) => {
    e.preventDefault();
    if (!formName || !formZone) {
      alert("Incomplete data allocation payload matrix.");
      return;
    }
    try {
      await api.updateSlot({
        uid: formSlot,
        name: formName,
        assignedZone: formZone,
        alertThresholdPreference: parseFloat(formThreshold)
      }, authToken);
      alert("Persistent hardware parameters allocated safely onto host disk space.");
      setFormName('');
      setFormZone('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#11121d', padding: '30px', borderRadius: '12px', border: '1px solid #1e2030', maxWidth: '620px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '1.2rem', fontWeight: '700' }}>⚙️ Reallocate Telemetry Monitoring Profile Slots</h3>
        <p style={{ margin: '0', fontSize: '0.8rem', color: '#718096' }}>Modifies the server filesystem buffer tables directly for specific hardware channel address layers.</p>
      </div>

      <form onSubmit={handleUpdateSlot} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px' }}>TARGET HARDWARE DATA SLOT ADDRESS</label>
          <select value={formSlot} onChange={(e) => setFormSlot(e.target.value)} style={{ width: '100%', backgroundColor: '#0c0d14', border: '1px solid #2d3142', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            <option value="slot_01">Hardware Node Slot 01 (Mary)</option>
            <option value="slot_02">Hardware Node Slot 02 (Brian)</option>
            <option value="slot_03">Hardware Node Slot 03 (Auxiliary Alpha)</option>
            <option value="slot_04">Hardware Node Slot 04 (Auxiliary Beta)</option>
            <option value="slot_05">Hardware Node Slot 05 (Auxiliary Gamma)</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px' }}>SUBJECT IDENTIFIER (NAME KEY)</label>
          <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Mary Rioba" style={{ width: '96%', backgroundColor: '#0c0d14', border: '1px solid #2d3142', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px' }}>LOCALIZED TRACKING ZONE (SECTOR SPATIAL COORDINATE)</label>
          <input type="text" required value={formZone} onChange={(e) => setFormZone(e.target.value)} placeholder="e.g. Nairobi Central Sector" style={{ width: '96%', backgroundColor: '#0c0d14', border: '1px solid #2d3142', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px', fontFamily: 'monospace' }}>
            CRITICAL BOUNDARY LIMIT VALUE THRESHOLD: <span style={{ color: dynamicAccent, fontWeight: 'bold' }}>{Math.round(formThreshold * 100)}%</span>
          </label>
          <input type="range" min="0.10" max="0.95" step="0.05" value={formThreshold} onChange={(e) => setFormThreshold(parseFloat(e.target.value))} style={{ width: '100%', accentColor: dynamicAccent, cursor: 'pointer', marginTop: '4px' }} />
        </div>

        <button type="submit" style={{ backgroundColor: dynamicAccent, color: '#07080d', fontWeight: 'bold', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          COMMIT HARDWARE REALLOCATION MATCH
        </button>
      </form>
    </div>
  );
}