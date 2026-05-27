require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');

const { User, HardwareSlot, TelemetryLog } = require('./SystemModels');

const app = express();
const PORT = process.env.PORT || 5001;

// ⚠️  secrets  code
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

app.use(cors());
app.use(express.json());
// =========================================================
// MONGO DB CONNECTION (FIXED + SAFE)
// =========================================================

// Only ONE source of truth for Mongo URI
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('❌ MONGO_URI is not defined in environment variables');
    process.exit(1);
}

// Fixed: Removed deprecated useNewUrlParser and useUnifiedTopology options
mongoose.connect(mongoURI)
.then(() => {
    console.log('🔌 [Database Subsystem] Secure cloud pipeline link to MongoDB Atlas verified.');
    console.log('🚀 [Database Subsystem] Cluster Instance: cluster0.m1ktsbv.mongodb.net');
})
.catch(err => {
    console.error('❌ [Database Subsystem] Cloud Handshake Fault!');
    console.error('👉 Diagnostic Details:', err.message || err);
});
// Auto-Seeding Database Hardware Slot Allocations upon initial boot state
async function verifyAndSeedHardwareMatrix() {
  try {
    const slotCount = await HardwareSlot.countDocuments();
    if (slotCount === 0) {
      const standardMatrix = [
        { uid: 'slot_01', name: 'Mary', assignedZone: 'Nairobi Central Sector', alertThresholdPreference: 0.70 },
        { uid: 'slot_02', name: 'Brian', assignedZone: 'SEKU Campus Vector', alertThresholdPreference: 0.55 },
        { uid: 'slot_03', name: 'Unassigned Channel Alpha', assignedZone: 'Clear Bound', alertThresholdPreference: 0.60 },
        { uid: 'slot_04', name: 'Unassigned Channel Beta', assignedZone: 'Clear Bound', alertThresholdPreference: 0.60 },
        { uid: 'slot_05', name: 'Unassigned Channel Gamma', assignedZone: 'Clear Bound', alertThresholdPreference: 0.60 },
        { uid: 'slot_06', name: 'Unassigned Channel Delta', assignedZone: 'Clear Bound', alertThresholdPreference: 0.60 },
        { uid: 'slot_07', name: 'Unassigned Channel Epsilon', assignedZone: 'Clear Bound', alertThresholdPreference: 0.60 },
        { uid: 'slot_08', name: 'Unassigned Channel Zeta', assignedZone: 'Clear Bound', alertThresholdPreference: 0.60 },
        { uid: 'slot_09', name: 'Unassigned Channel Eta', assignedZone: 'Clear Bound', alertThresholdPreference: 0.60 },
        { uid: 'slot_10', name: 'Unassigned Channel Theta', assignedZone: 'Clear Bound', alertThresholdPreference: 0.60 }
      ];
      await HardwareSlot.insertMany(standardMatrix);
      console.log('📦 [Database Subsystem] Default hardware channel matrix initialized securely.');
    }
  } catch (error) {
    console.error('❌ [Database Subsystem] Fatal Exception during hardware matrix seed sequence:', error);
  }
}

mongoose.connection.once('open', () => {
  verifyAndSeedHardwareMatrix();
});

// =========================================================================
// SECURITY MIDDLEWARE GATEKEEPER
// =========================================================================
const authenticateTokenGuard = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Denied: Inbound request lacks cryptographic authentication token.' });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decodedUser) => {
    if (err) return res.status(403).json({ error: 'Forbidden: Verification token checksum failed or expired.' });
    req.user = decodedUser;
    next();
  });
};

// =========================================================================
// ASYNCHRONOUS AUTHENTICATION ROUTES (MONGO MIGRATED WITH DEFENSIVE FIELDS)
// =========================================================================

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, country } = req.body;
    
    // Normalize naming permutations from client application forms
    const fullName = req.body.fullName || req.body.name;
    const phone = req.body.phone || req.body.telephone || "+254700000000";

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Incomplete Demographics Array: Email, password, and registration name fields are required.' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({ error: 'Conflict: This network email allocation already maps to an active terminal node.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUserNode = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      country: country || 'Kenya',
      status: 'VERIFIED_LAB_PROVISIONAL'
    });

    await newUserNode.save();
    console.log(`👤 [Auth Engine] Node successfully generated for: ${email.toLowerCase()}`);

    res.status(201).json({ message: 'User verification infrastructure generated successfully.' });
  } catch (error) {
    console.error('❌ MONGODB SIGNUP REGISTRATION ERROR:', error.message || error);
    res.status(500).json({ error: 'Internal Server Fault during cryptographic registration sequence.', details: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Credentials Missing from incoming transaction packet.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Authentication Refused: Target identity node not discovered.' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Authentication Refused: Cryptographic token validation failed.' });

    const sessionToken = jwt.sign(
      { userId: user._id, email: user.email, name: user.fullName, status: user.status },
      JWT_SECRET_KEY,
      { expiresIn: '8h' }
    );

    res.json({
      token: sessionToken,
      user: { name: user.fullName, email: user.email, country: user.country, status: user.status }
    });
  } catch (error) {
    console.error('Login engine exception:', error);
    res.status(500).json({ error: 'Internal Cryptographic Component processing fault.' });
  }
});

// =========================================================================
// REAL-TIME BIOMEDICAL ENGINEERING & URBAN DATA LOGIC (FULLY MONGO PERSISTED)
// =========================================================================

let packetSequenceCount = 0;

app.get('/api/stress', authenticateTokenGuard, async (req, res) => {
  try {
    const userId = req.query.userId || 'slot_01';
    
    // Direct operational lookups targeting Mongoose documents instead of disk storage reads
    let currentSlot = await HardwareSlot.findOne({ uid: userId });
    if (!currentSlot) {
      currentSlot = await HardwareSlot.findOne({ uid: 'slot_01' }) || {
        uid: 'slot_01',
        name: 'Mary',
        assignedZone: 'Nairobi Central Sector',
        alertThresholdPreference: 0.70
      };
    }

    packetSequenceCount++;

    const dateObj = new Date();
    const currentHours = dateObj.getHours();
    const currentMinutes = dateObj.getMinutes();
    const currentSeconds = dateObj.getSeconds();
    const decimalTime = currentHours + currentMinutes / 60 + currentSeconds / 3600;

    const computeGaussianCurve = (t, peak, width) => Math.exp(-Math.pow(t - peak, 2) / (2 * Math.pow(width, 2)));
    const morningCommuteSpike = computeGaussianCurve(decimalTime, 8.0, 1.2) * 0.42;
    const eveningCommuteSpike = computeGaussianCurve(decimalTime, 17.5, 1.5) * 0.48;
    const combinedCommuteMultiplier = morningCommuteSpike + eveningCommuteSpike;

    const baselineSomaticNoise = Math.sin(decimalTime * Math.PI) * 0.05 + 0.35;
    const dspLowFreq30Hz = Math.abs(Math.sin(decimalTime * 2.0 * Math.PI)) * 0.6 + 0.1;
    const dspMidFreq120Hz = Math.abs(Math.cos(decimalTime * 5.5 * Math.PI)) * 0.4;
    
    let finalIntegratedSomaticIndex = baselineSomaticNoise + combinedCommuteMultiplier + (dspLowFreq30Hz * 0.1);
    if (finalIntegratedSomaticIndex > 1.0) finalIntegratedSomaticIndex = 1.0;
    if (finalIntegratedSomaticIndex < 0.0) finalIntegratedSomaticIndex = 0.0;

    const calculusStateVelocity = (Math.cos(decimalTime * Math.PI) * 0.012) + (combinedCommuteMultiplier * 0.005);
    const calculusStateAcceleration = (-Math.sin(decimalTime * Math.PI) * 0.004);

    let aiStatusHeadline = "SIMULATED_DSP_LOOP";
    
    const calculatedHeartRate = 65 + (finalIntegratedSomaticIndex * 45) + (Math.sin(decimalTime * 10) * 3);
    const derivedSleepDuration = 8.5 - (combinedCommuteMultiplier * 4.0);
    const runningWorkloadIntensity = Math.min(1.0, Math.max(0.0, combinedCommuteMultiplier + 0.2));
    const systemicExerciseFrequency = 3;

    try {
      const mlResponse = await axios.post('http://127.0.0.1:8000/api/predict/stress', {
        heart_rate: parseFloat(calculatedHeartRate.toFixed(2)),
        sleep_duration: parseFloat(derivedSleepDuration.toFixed(2)),
        workload_intensity: parseFloat(runningWorkloadIntensity.toFixed(2)),
        exercise_frequency: parseInt(systemicExerciseFrequency)
      });

      if (mlResponse.data && mlResponse.data.status === "ANALYSIS_SUCCESSFUL") {
        finalIntegratedSomaticIndex = mlResponse.data.calculatedStressScore;
        aiStatusHeadline = `AI LIVE: ${mlResponse.data.stressClassification} — ${mlResponse.data.clinicalRecommendation}`;
      }
    } catch (error) {
      aiStatusHeadline = `AI BUS STANDBY: Fallback Mode Active (FastAPI Node Offline)`;
    }

    let evaluatedThreat = 'NOMINAL';
    if (finalIntegratedSomaticIndex > currentSlot.alertThresholdPreference) {
      evaluatedThreat = 'EXCESSIVE_ENVIRONMENTAL_STRAIN';

      // Record breach parameters dynamically matching every required field in your schema
      const newLogEntry = new TelemetryLog({
        timestamp: new Date().toLocaleTimeString(),
        slotUid: currentSlot.uid, // Explicit mapping to satisfy your new strict index rules
        memberName: currentSlot.name,
        monitoredContext: `Dynamic Grid Violation detected at spatial coordinate zone: ${currentSlot.assignedZone}`,
        exposureLevel: `${Math.round(finalIntegratedSomaticIndex * 100)}% Peak Intensity`
      });
      await newLogEntry.save();
    }

    // High performance projections queries to feed UI listing matrices
    const rawAllSlots = await HardwareSlot.find().sort({ uid: 1 });
    const allSlotsMap = {};
    rawAllSlots.forEach(s => { allSlotsMap[s.uid] = s; });

    const historicalFamilyLogs = await TelemetryLog.find()
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({
      nodeId: 'SEKU_LAB_NODE_04x',
      packetSequence: packetSequenceCount,
      rawTelemetry: { decimalTime },
      currentFamilySession: currentSlot,
      dspSpectralAnalysis: {
        lowFreqRumble_30Hz: dspLowFreq30Hz,
        midFreqHum_120Hz: dspMidFreq120Hz
      },
      predictiveAnalytics: {
        currentHsi: finalIntegratedSomaticIndex,
        stateVelocity: calculusStateVelocity,
        stateAcceleration: calculusStateAcceleration
      },
      decisionMatrix: { evaluatedThreat },
      allSlots: allSlotsMap,
      historicalFamilyLogs: historicalFamilyLogs,
      statusHeadline: aiStatusHeadline
    });

  } catch (error) {
    console.error('❌ Data stream pipeline execution failure:', error.message || error);
    res.status(500).json({ error: 'Telemetry data ingestion track dropped a frame or failed validation.', details: error.message });
  }
});

app.post('/api/slots/update', authenticateTokenGuard, async (req, res) => {
  try {
    const { uid, name, assignedZone, alertThresholdPreference } = req.body;
    if (!uid) return res.status(400).json({ error: 'Bus Update Denied: Missing slot identifier.' });

    const targetSlot = await HardwareSlot.findOne({ uid });
    if (targetSlot) {
      if (name) targetSlot.name = name;
      if (assignedZone) targetSlot.assignedZone = assignedZone;
      if (alertThresholdPreference !== undefined) targetSlot.alertThresholdPreference = alertThresholdPreference;
      
      await targetSlot.save();
      return res.json({ status: 'SUCCESS', details: 'Persistent Mongoose channel allocations updated.' });
    }

    res.status(404).json({ error: 'Slot position address not found within memory allocation tables.' });
  } catch (error) {
    console.error('Slot adjustment fault:', error);
    res.status(500).json({ error: 'Internal pipeline modification exception.' });
  }
});

app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🏛️  NEUROCITY AI SECURITY CORE OPERATIONAL ON PORT: ${PORT}`);
  console.log(`🔒 SECURE MIDDLEWARE TOKEN ROUTES ACTIVE (FULLY PERSISTED VIA MONGO)`);
  console.log(`================================================================`);
});