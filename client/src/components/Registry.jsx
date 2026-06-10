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
      alert("Please complete all fields before saving the profile.");
      return;
    }
    try {
      await api.updateSlot({
        uid: formSlot,
        name: formName,
        assignedZone: formZone,
        alertThresholdPreference: parseFloat(formThreshold)
      }, authToken);
      alert("Profile updated successfully.");
      setFormName('');
      setFormZone('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#11121d', padding: '30px', borderRadius: '12px', border: '1px solid #1e2030', maxWidth: '620px', margin: '0 auto' }}>
      
      {/* --- HEADER TITLE SECTION --- */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '1.2rem', fontWeight: '700' }}>
          👥 Patient Registry Management
        </h3>
        <p style={{ margin: '0', fontSize: '0.8rem', color: '#718096', lineHeight: '1.4' }}>
          Set up user accounts, customize monitoring locations, and set personalized alert triggers.
        </p>
      </div>

      {/* --- REGISTRY PROFILE FORM --- */}
      <form onSubmit={handleUpdateSlot} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* Simplified Profile Slot Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '0.5px' }}>
            SELECT PROFILE SLOT
          </label>
          <select value={formSlot} onChange={(e) => setFormSlot(e.target.value)} style={{ width: '100%', backgroundColor: '#0c0d14', border: '1px solid #2d3142', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', outline: 'none', cursor: 'pointer' }}>
            <option value="slot_01">Profile Slot 01 (Demo Active)</option>
            <option value="slot_02">Profile Slot 02 (Demo Active)</option>
            <option value="slot_03">Profile Slot 03 [Available]</option>
            <option value="slot_04">Profile Slot 04 [Available]</option>
            <option value="slot_05">Profile Slot 05 [Available]</option>
          </select>
        </div>
        
        {/* Patient Name Input */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '0.5px' }}>
            PATIENT NAME
          </label>
          <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. John Doe" style={{ width: '96%', backgroundColor: '#0c0d14', border: '1px solid #2d3142', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }} />
        </div>

        {/* Location / Region Input */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '0.5px' }}>
            MONITORING REGION
          </label>
          <input type="text" required value={formZone} onChange={(e) => setFormZone(e.target.value)} placeholder="e.g. Nairobi" style={{ width: '96%', backgroundColor: '#0c0d14', border: '1px solid #2d3142', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }} />
        </div>

        {/* Dynamic Sensitivity Slider Component */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '0.5px' }}>
            STRESS ALERT TRIGGER SENSITIVITY: <span style={{ color: dynamicAccent, fontWeight: 'bold' }}>{Math.round(formThreshold * 100)}%</span>
          </label>
          <input type="range" min="0.10" max="0.95" step="0.05" value={formThreshold} onChange={(e) => setFormThreshold(parseFloat(e.target.value))} style={{ width: '100%', accentColor: dynamicAccent, cursor: 'pointer', marginTop: '4px' }} />
        </div>

        {/* Form Submission Control Button */}
        <button type="submit" style={{ backgroundColor: dynamicAccent, color: '#07080d', fontWeight: 'bold', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'opacity 0.2s ease' }}>
          Save Profile Updates
        </button>
      </form>
    </div>
  );
}