import React from 'react';

export default function SignupForm({ 
  email, setEmail, 
  password, setPassword, 
  fullName, setFullName, 
  phone, setPhone, 
  onSubmit, toggleMode 
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px' }}>
          FULL NAME
        </label>
        <input 
          type="text" 
          required 
          value={fullName} 
          onChange={e => setFullName(e.target.value)} 
          placeholder="e.g. Brian Nyarega" 
          style={{ width: '94%', backgroundColor: '#0c0d14', border: '1px solid #2d3142', color: '#fff', padding: '12px', borderRadius: '8px' }} 
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px' }}>
           EMAIL
        </label>
        <input 
          type="email" 
          required 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="engineer@neurocity.ai" 
          style={{ width: '94%', backgroundColor: '#0c0d14', border: '1px solid #2d3142', color: '#fff', padding: '12px', borderRadius: '8px' }} 
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px' }}>
          PHONE NUMBER
        </label>
        <input 
          type="text" 
          required 
          value={phone} 
          onChange={e => setPhone(e.target.value)} 
          placeholder="+254..." 
          style={{ width: '94%', backgroundColor: '#0c0d14', border: '1px solid #2d3142', color: '#fff', padding: '12px', borderRadius: '8px' }} 
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px' }}>
          PASSWORD
        </label>
        <input 
          type="password" 
          required 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="••••••••" 
          style={{ width: '94%', backgroundColor: '#0c0d14', border: '1px solid #2d3142', color: '#fff', padding: '12px', borderRadius: '8px' }} 
        />
      </div>

      <button 
        type="submit" 
        style={{ backgroundColor: '#00ffcc', color: '#07080d', fontWeight: 'bold', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
      >
        CREATE ACCOUNT
      </button>

      <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.85rem' }}>
        <span style={{ color: '#718096' }}>Already verified?</span>
        <button 
          type="button" 
          onClick={toggleMode} 
          style={{ background: 'none', border: 'none', color: '#00ffcc', cursor: 'pointer', fontWeight: 'bold', marginLeft: '6px' }}
        >
          Return to Login
        </button>
      </div>
    </form>
  );
}