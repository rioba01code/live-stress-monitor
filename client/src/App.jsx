import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Cockpit from './components/Cockpit';
import Registry from './components/Registry';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import { useTelemetry } from './hooks/useTelemetry';
import { api } from './services/api';
import axios from 'axios';

export default function App() {
  const [currentTab, setCurrentTab] = useState('Cockpit');
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [authMode, setAuthMode] = useState('login');
  const [selectedSlotUid, setSelectedSlotUid] = useState('slot_01');
  const [isAuthenticating, setIsAuthenticating] = useState(false); // Gate to block racing requests

  // Unified State for storing the dynamic Operator Session profile details
  const [userProfile, setUserProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('userProfile')) || null;
    } catch {
      return null;
    }
  });

  // Universal subject tracking state layers
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // Unified authentication form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Clear application states cleanly on log-out operations
  const handleTermination = () => {
    setIsAuthenticating(true); // Halts tracking loops immediately
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    setAuthToken('');
    setIsLoggedIn(false);
    setUserProfile(null);
    setSubjects([]);
    setSelectedSubjectId('');
    // Safely open the gates for the login screen fields
    setTimeout(() => setIsAuthenticating(false), 100);
  };

  // Connected telemetry hooks - Only tracks when logged in and NOT switching auth status
  const { data, dynamicAccent } = useTelemetry(
    isLoggedIn && !isAuthenticating, 
    selectedSlotUid, 
    authToken, 
    handleTermination
  );

  // Synchronization effect to poll available registry monitoring indices
  useEffect(() => {
    const fetchUniversalSubjects = async () => {
      if (!isLoggedIn || !authToken || isAuthenticating) return;
      try {
        const response = await axios.get('http://localhost:5001/api/subjects', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        if (response.data && response.data.success) {
          const subjectData = response.data.data;
          setSubjects(subjectData);
          if (subjectData.length > 0) {
            setSelectedSubjectId(subjectData[0]._id);
          }
        }
      } catch (err) {
        // Suppress console noise if a fetch triggers slightly before state unmounts
        if (isLoggedIn && !isAuthenticating) {
          console.error("❌ Failed to query system subject registry indices:", err.message);
        }
      }
    };

    fetchUniversalSubjects();
  }, [isLoggedIn, authToken, currentTab, isAuthenticating]);

  // Robust Form Authentication submission handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsAuthenticating(true); // Lock background requests during submission
      
      if (authMode === 'login') {
        const resData = await api.login(email, password);
        
        // 1. Deep scans the payload response for variant name formats from backend
        const backendName = resData?.user?.fullName || 
                             resData?.user?.name || 
                             resData?.user?.username || 
                             resData?.fullName ||
                             resData?.username;

        // 2. Converts to standard string object, falling back safely to parsed email 
        const operatorIdentifier = backendName || email.split('@')[0];
        const profilePayload = { username: operatorIdentifier };
        
        // 3. Persistent atomic allocation across caching system structures BEFORE state update
        localStorage.setItem('token', resData.token);
        localStorage.setItem('userProfile', JSON.stringify(profilePayload));
        
        setAuthToken(resData.token);
        setUserProfile(profilePayload);
        setIsLoggedIn(true);
        
        // Reset form inputs cleanly
        setEmail('');
        setPassword('');
      } else {
        const resData = await api.signup({ email, password, fullName, phone });
        alert(resData.message || "Registration completed successfully.");
        setAuthMode('login');
      }
    } catch (err) {
      alert(err.message || "Authentication transmission fault encountered.");
    } finally {
      // Release authorization gate safely once memory state settles
      setTimeout(() => setIsAuthenticating(false), 200);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0c0d14', color: '#cbd5e0', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#11121d', padding: '35px', borderRadius: '16px', border: '1px solid #1e2030', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h1 style={{ color: '#fff', fontSize: '1.8rem', margin: '0 0 5px 0', fontWeight: '800', letterSpacing: '-0.5px' }}>AkiliPeace</h1>
            <span style={{ fontSize: '0.75rem', color: '#00ffcc', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your mental Health Patner</span>
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
      <Sidebar 
        data={data} 
        user={userProfile} 
        selectedSlotUid={selectedSlotUid} 
        setSelectedSlotUid={setSelectedSlotUid} 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        handleTermination={handleTermination}
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        setSelectedSubjectId={setSelectedSubjectId}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        <Header />
        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          {currentTab === 'Cockpit' && (
            <Cockpit 
              data={data} 
              dynamicAccent={dynamicAccent} 
              selectedSubjectId={selectedSubjectId}
              subjects={subjects}
            />
          )}
          {currentTab === 'Registry' && (
            <Registry 
              authToken={authToken} 
              dynamicAccent={dynamicAccent} 
              onRegistryUpdate={() => setCurrentTab('Cockpit')} 
            />
          )}
        </div>
      </main>
    </div>
  );
}