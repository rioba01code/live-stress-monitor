import React, { useEffect, useRef } from 'react';

/**
 * Animated Oscilloscope Engine
 * Renders multi-harmonic sine waves using real-time velocity and acceleration vectors on a 60 FPS Canvas thread.
 */
function CalculusWaveforms({ telemetryData, primaryAccent }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const velocity = telemetryData?.predictiveAnalytics?.stateVelocity || 0.005;
    const acceleration = telemetryData?.predictiveAnalytics?.stateAcceleration || -0.002;
    const currentHsi = telemetryData?.predictiveAnalytics?.currentHsi || 0.5;

    const renderOscilloscope = () => {
      // Clear canvas with trail alpha to create phosphorescent glow decay
      ctx.fillStyle = 'rgba(12, 13, 20, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background instrument grid
      ctx.strokeStyle = '#1e2030';
      ctx.lineWidth = 0.5;
      const gridSize = 30;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Draw baseline zero axis
      ctx.strokeStyle = '#2d3142';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2); ctx.stroke();

      // Setup signal tracer styles
      ctx.strokeStyle = primaryAccent;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = primaryAccent;
      ctx.beginPath();

      // Step spatial phase frequency relative to system dynamics (v + a)
      phaseRef.current += (velocity * 2 + Math.abs(acceleration) * 5);

      // Compute multi-harmonic waveform equations
      for (let x = 0; x < canvas.width; x += 2) {
        const omega = 0.015; 
        const amplitude = (canvas.height * 0.25) * (currentHsi + 0.2);
        
        const fundamentalHarmonic = Math.sin(x * omega + phaseRef.current);
        const secondHarmonic = Math.sin(x * (omega * 2) * 0.5 - phaseRef.current * 0.7) * 0.3;
        
        const y = (canvas.height / 2) + (fundamentalHarmonic + secondHarmonic) * amplitude;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Disable shadow map for performance outside tracer path

      animationRef.current = requestAnimationFrame(renderOscilloscope);
    };

    renderOscilloscope();
    return () => cancelAnimationFrame(animationRef.current);
  }, [telemetryData, primaryAccent]);

  return (
    <div style={{ backgroundColor: '#11121d', padding: '22px', borderRadius: '12px', border: '1px solid #1e2030', marginBottom: '25px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ color: '#718096', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          🧠 Real-Time Body Response Tracker
        </span>
        <span style={{ fontSize: '0.65rem', backgroundColor: '#0c0d14', color: primaryAccent, padding: '3px 8px', borderRadius: '4px', fontFamily: 'monospace', border: `1px solid ${primaryAccent}40` }}>
          Live Data Stream
        </span>
      </div>
      <canvas ref={canvasRef} width={750} height={180} style={{ width: '100%', backgroundColor: '#0c0d14', borderRadius: '8px', border: '1px solid #1e2030' }} />
    </div>
  );
}

/**
 * Main Cockpit Workarea View Panel Component
 * Intercepts real-time human subject profile matrices.
 */
export default function Cockpit({ data, dynamicAccent, selectedSubjectId, subjects = [] }) {
  // Find the matching human tracking profile from the state array
  const activeSubject = subjects.find(sub => sub._id === selectedSubjectId);

  // Dynamic calculus/fallback variables resolution
  const displayName = activeSubject ? activeSubject.name : (data?.currentFamilySession?.name || 'Mary');
  const displayCategory = activeSubject ? activeSubject.profileCategory : 'Legacy Hardware Channel';
  const displayNotes = activeSubject ? (activeSubject.metadata?.notes || 'No calibration metrics log notes available.') : (data?.currentFamilySession?.assignedZone || 'Evaluating GPS Frame');

  return (
    <div>
      {/* Metrics Row - Locked to symmetric 50/50 division layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        
        {/* Active Telemetry Profile Card with Custom Dynamic Mappings */}
        <div style={{ 
          backgroundColor: '#11121d', 
          padding: '25px', 
          borderRadius: '12px', 
          border: `1px solid ${dynamicAccent}25`, 
          borderLeft: `6px solid ${dynamicAccent}`, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          {/* Left Text Block */}
          <div style={{ minWidth: '0', flex: '1', marginRight: '15px' }}>
            <span style={{ color: '#718096', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block' }}>Active Individual Profile</span>
            
            <h2 style={{ margin: '4px 0', color: '#fff', fontSize: '1.6rem', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </h2>
            
            {/* NEW: DYNAMIC APPLICATION ENVELOPE TAG FOCUS */}
            <div style={{ display: 'inline-flex', alignItems: 'center', margin: '4px 0 8px 0', backgroundColor: 'rgba(0, 255, 204, 0.04)', border: '1px solid rgba(0, 255, 204, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.65rem', color: dynamicAccent, fontFamily: 'monospace', fontWeight: 'bold' }}>
                FOCUS: {displayCategory}
              </span>
            </div>

            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#a0aec0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Monitoring Context: <strong style={{ color: '#cbd5e0' }}>{displayNotes}</strong>
            </p>
            
            <div style={{ marginTop: '12px', fontSize: '0.75rem', color: dynamicAccent, fontFamily: 'monospace', fontWeight: 'bold' }}>
              {activeSubject ? `AI CORE MAPPED SUCCESSFULLY — [AGE: ${activeSubject.age || 'N/A'}]` : (data?.statusHeadline || 'Syncing ML Core...')}
            </div>
          </div>
          
          {/* Right Numeric Block */}
          <div style={{ flexShrink: '0', textAlign: 'right' }}>
            <span style={{ fontSize: '3.2rem', fontWeight: '900', color: '#fff', fontFamily: 'monospace', lineHeight: '1' }}>
              {data?.predictiveAnalytics?.currentHsi !== undefined ? Math.round(data.predictiveAnalytics.currentHsi * 100) : 0}%
            </span>
            <div style={{ fontSize: '0.6rem', color: '#718096', fontWeight: 'bold', marginTop: '4px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>WELLNESS INDEX</div>
          </div>
        </div>

        {/* Ingestion Stream Status Card */}
        <div style={{ backgroundColor: '#11121d', padding: '20px', borderRadius: '12px', border: '1px solid #1e2030', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: '#718096', fontSize: '0.65rem', display: 'block', fontWeight: 'bold', fontFamily: 'monospace' }}>Data Update Frequency</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginTop: '5px', fontFamily: 'monospace' }}>1-Second Update Interval</div>
          </div>
          <div style={{ borderTop: '1px solid #1e2030', paddingTop: '10px' }}>
            <span style={{ color: '#4a5568', fontSize: '0.6rem', display: 'block', fontFamily: 'monospace' }}>📊 Total Monitoring Records</span>
            <span style={{ fontSize: '0.9rem', color: '#fff', fontFamily: 'monospace', fontWeight: 'bold' }}>{data?.packetSequence || 0} Sequences</span>
          </div>
        </div>
      </div>

      {/* Real-Time Waveform Monitor Section */}
      <CalculusWaveforms telemetryData={data} primaryAccent={dynamicAccent} />

      {/* Secondary Signal Evaluation Deck */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
        
        {/* Discrete Fourier Transform Bands30HZ and 120 HZ */}
        <div style={{ backgroundColor: '#11121d', padding: '22px', borderRadius: '10px', border: '1px solid #1e2030' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '0.75rem', color: '#fff', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.5px' }}>🔬 Trend Analysis</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                <span style={{ color: '#a0aec0' }}>Low-Frequency Activity</span>
                <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{Math.round((data?.dspSpectralAnalysis?.lowFreqRumble_30Hz || 0) * 100)}%</strong>
              </div>
              <div style={{ width: '100%', backgroundColor: '#0c0d14', height: '6px', borderRadius: '3px', border: '1px solid #1e2030' }}>
                <div style={{ width: `${Math.min(100, Math.round((data?.dspSpectralAnalysis?.lowFreqRumble_30Hz || 0) * 100))}%`, backgroundColor: dynamicAccent, height: '100%', borderRadius: '3px', transition: 'width 0.9s ease' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                <span style={{ color: '#a0aec0' }}>Mid-Frequency Activity</span>
                <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{Math.round((data?.dspSpectralAnalysis?.midFreqHum_120Hz || 0) * 100)}%</strong>
              </div>
              <div style={{ width: '100%', backgroundColor: '#0c0d14', height: '6px', borderRadius: '3px', border: '1px solid #1e2030' }}>
                <div style={{ width: `${Math.min(100, Math.round((data?.dspSpectralAnalysis?.midFreqHum_120Hz || 0) * 100))}%`, backgroundColor: dynamicAccent, opacity: 0.7, height: '100%', borderRadius: '3px', transition: 'width 0.9s ease' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mathematical Dynamics Calculus Panel */}
        <div style={{ backgroundColor: '#11121d', padding: '22px', borderRadius: '10px', border: '1px solid #1e2030' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '0.75rem', color: '#fff', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.5px' }}>📈 Trend Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1e2030' }}>
              <span style={{ color: '#718096' }}>Rate of Change:</span> 
              <span style={{ color: dynamicAccent, fontWeight: 'bold' }}>{data?.predictiveAnalytics?.stateVelocity?.toFixed(5) || '0.00000'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1e2030' }}>
              <span style={{ color: '#718096' }}>Trend Momentum:</span> 
              <span style={{ color: dynamicAccent, fontWeight: 'bold' }}>{data?.predictiveAnalytics?.stateAcceleration?.toFixed(5) || '0.00000'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#718096' }}>Alert Threshold:</span> 
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{Math.round((data?.currentFamilySession?.alertThresholdPreference || 0) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Relational Database Memory Event Deck */}
      <section style={{ backgroundColor: '#11121d', borderRadius: '12px', border: '1px solid #1e2030', padding: '22px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '0.75rem', color: '#fff', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.5px' }}>🗄️ Monitoring History</h3>
        {!data?.historicalFamilyLogs || data.historicalFamilyLogs.length === 0 ? (
          <div style={{ padding: '15px 0', color: '#4a5568', fontFamily: 'monospace', fontSize: '0.8rem', textAlign: 'center' }}>
            Monitoring history is clear.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.8rem', fontFamily: 'monospace', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#718096', borderBottom: '2px solid #1e2030' }}>
                  <th style={{ padding: '10px' }}>Monitoring Time</th>
                  <th style={{ padding: '10px' }}>Monitored Profile</th>
                  <th style={{ padding: '10px' }}>Environment</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {data.historicalFamilyLogs.map((log, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #1e2030', color: '#e2e8f0', backgroundColor: 'rgba(255, 51, 51, 0.02)' }}>
                    <td style={{ padding: '10px', color: '#a0aec0' }}>{log.timestamp}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#fff' }}>{log.memberName}</td>
                    <td style={{ padding: '10px', color: '#718096' }}>{log.monitoredContext}</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: '#ff5555', fontWeight: 'bold' }}>{log.exposureLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}