import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Cockpit from './components/Cockpit';
import Registry from './components/Registry';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import { useTelemetry } from './hooks/useTelemetry';
import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('Cockpit');
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [authMode, setAuthMode] = useState('login');
  const [selectedSlotUid, setSelectedSlotUid] = useState('slot_01');

  // Unified authentication form parameters
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleTermination = () => {
    localStorage.removeItem('token');
    setAuthToken('');
    setIsLoggedIn(false);
  };

  // Connects custom telemetry synchronization hook
  const { data, dynamicAccent } = useTelemetry(isLoggedIn, selectedSlotUid, authToken, handleTermination);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        const resData = await api.login(email, password);
        localStorage.setItem('token', resData.token);
        setAuthToken(resData.token);
        setIsLoggedIn(true);
      } else {
        const resData = await api.signup({ email, password, fullName, phone });
        alert(resData.message);
        setAuthMode('login');
      }
    } catch (err) {
      alert(err.message || "Cryptographic Gatekeeper authentication transmission fault.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0c0d14', color: '#cbd5e0', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#11121d', padding: '35px', borderRadius: '16px', border: '1px solid #1e2030', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h1 style={{ color: '#fff', fontSize: '1.8rem', margin: '0 0 5px 0', fontWeight: '800', letterSpacing: '-0.5px' }}>🏛️ NeuroCity AI</h1>
            <span style={{ fontSize: '0.75rem', color: '#00ffcc', fontFamily: 'monospace', fontWeight: 'bold', textTransform: 'uppercase' }}>Biomedical Engineering Gateway Core</span>
          </div>
          {authMode === 'login' ? (
            <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} onSubmit={handleAuthSubmit} toggleMode={() => setAuthMode('signup')} />
          ) : (
            <SignupForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} fullName={fullName} setFullName={setFullName} phone={phone} setPhone={setPhone} onSubmit={handleAuthSubmit} toggleMode={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#0c0d14', color: '#cbd5e0', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Sidebar data={data} selectedSlotUid={selectedSlotUid} setSelectedSlotUid={setSelectedSlotUid} currentTab={currentTab} setCurrentTab={setCurrentTab} handleTermination={handleTermination} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        <Header />
        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          {currentTab === 'Cockpit' && <Cockpit data={data} dynamicAccent={dynamicAccent} />}
          {currentTab === 'Registry' && <Registry authToken={authToken} dynamicAccent={dynamicAccent} />}
        </div>
      </main>
    </div>
  );
}