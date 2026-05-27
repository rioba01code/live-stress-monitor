// Web Audio Context fallback initialization for cross-browser hardware links
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

export const notificationService = {
  /**
   * Requests OS-level permissions to dispatch desktop alert messages
   */
  requestPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log(`[Security Subsystem] Desktop notification status: ${permission}`);
      return permission;
    }
    return 'unsupported';
  },

  /**
   * Synthesizes a raw hardware-level acoustic alarm tone using an oscillator node
   */
  triggerAudioAlarm: (durationMs = 300) => {
    try {
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }

      // Resume context if browser suspended it due to user interaction security policies
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz (A5 Pitch Alarm)
      
      // Prevent speaker popping by applying an exponential volume envelope decay
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + durationMs / 1000);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + durationMs / 1000);
    } catch (err) {
      console.error("[Acoustic Driver Fault] Could not initialize audio context:", err);
    }
  },

  /**
   * Dispatches a system-level desktop toast notification block
   */
  triggerDesktopAlert: (subjectName, hsiValue, zone) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`⚠️ CRITICAL SOMATIC BREACH: ${subjectName.toUpperCase()}`, {
        body: `Somatic Index has surged to ${Math.round(hsiValue * 100)}% inside sector [${zone}]. Immediate intervention required.`,
        tag: `breach-${subjectName}`, // Prevents duplicate spam bubbles for the same subject
        requireInteraction: true // Keeps the alert pinned until manually dismissed by the engineer
      });
    }
  }
};