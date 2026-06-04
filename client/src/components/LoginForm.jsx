import React from 'react';

export default function LoginForm({ email, setEmail, password, setPassword, onSubmit, toggleMode }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px' }}>EMAIL</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="engineer@neurocity.ai" style={{ width: '94%', backgroundColor: '#0c0d14', border: '1px solid #2d3142', color: '#fff', padding: '12px', borderRadius: '8px' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', fontWeight: 'bold', marginBottom: '6px' }}>ENTER PASSWORD</label>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '94%', backgroundColor: '#0c0d14', border: '1px solid #2d3142', color: '#fff', padding: '12px', borderRadius: '8px' }} />
      </div>
      <button type="submit" style={{ backgroundColor: '#00ffcc', color: '#07080d', fontWeight: 'bold', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        LOGIN
      </button>
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
        <span style={{ color: '#718096' }}>No account?</span>
        <button type="button" onClick={toggleMode} style={{ background: 'none', border: 'none', color: '#00ffcc', cursor: 'pointer', fontWeight: 'bold', marginLeft: '6px' }}>Sign up</button>
      </div>
    </form>
  );
}