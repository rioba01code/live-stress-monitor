import React, { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const clockTimer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

  return (
    <header style={{ height: '70px', backgroundColor: '#11121d', borderBottom: '1px solid #1e2030', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '0 30px', justifyContent: 'space-between' }}>
      <div>
        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#718096', fontFamily: 'monospace' }}>SECURE ACCESS VECTOR: </span>
        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', backgroundColor: '#0c0d14', padding: '5px 10px', borderRadius: '4px', color: '#00ffcc', fontFamily: 'monospace', border: '1px solid #1e2030' }}>AUTOMATED DATA INTERCEPT LINK</span>
      </div>
      <div style={{ backgroundColor: '#0c0d14', padding: '6px 14px', borderRadius: '6px', border: '1px solid #1e2030', fontSize: '0.8rem', fontFamily: 'monospace' }}>
        <span style={{ color: '#4a5568', marginRight: '6px' }}>SYS CLOCK:</span>
        <strong style={{ color: '#fff' }}>{time.toLocaleTimeString()}</strong>
      </div>
    </header>
  );
}