import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { notificationService } from '../services/notificationService';

export function useTelemetry(isLoggedIn, selectedSlotUid, authToken, onAuthFault) {
  const [data, setData] = useState(null);
  const [dynamicAccent, setDynamicAccent] = useState('#00ffcc');
  
  // Track previous alert status to prevent system loop spamming
  const alertCooldownRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Automatically request desktop permissions upon secure station boot
    notificationService.requestPermission();

    const fetchFrame = async () => {
      try {
        const jsonFrame = await api.getTelemetry(selectedSlotUid, authToken);
        setData(jsonFrame);

        const hsi = jsonFrame?.predictiveAnalytics?.currentHsi || 0;
        const threshold = jsonFrame?.currentFamilySession?.alertThresholdPreference || 0.7;

        if (hsi > threshold) {
          setDynamicAccent('#ff3333'); // Alarm State (Red Hex)

          // Only trigger heavy OS notifications if we aren't already in an active alert cycle
          if (!alertCooldownRef.current) {
            notificationService.triggerAudioAlarm(400); // 400ms audio pulse
            notificationService.triggerDesktopAlert(
              jsonFrame.currentFamilySession.name,
              hsi,
              jsonFrame.currentFamilySession.assignedZone
            );
            alertCooldownRef.current = true;
          }
        } else {
          // Reset cooldown once somatic values drop back safely below threshold parameters
          alertCooldownRef.current = false;

          if (hsi > 0.45) {
            setDynamicAccent('#ffaa00'); // Warning State (Orange Hex)
          } else {
            setDynamicAccent('#00ffcc'); // Nominal Flow (Cyan Hex)
          }
        }
      } catch (err) {
        console.error("Telemetry pipeline degradation: ", err.message);
        if (err.message.includes('token') || err.message.includes('HTTP Network error')) {
          onAuthFault();
        }
      }
    };

    fetchFrame();
    const ticker = setInterval(fetchFrame, 1000);
    return () => clearInterval(ticker);
  }, [isLoggedIn, selectedSlotUid, authToken, onAuthFault]);

  return { data, dynamicAccent };
}