const mongoose = require('mongoose');

// =========================================================================
// 1. IDENTITY ARCHITECTURE SCHEMA
// =========================================================================
const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    country: { type: String, default: 'Kenya' },
    status: { type: String, default: 'VERIFIED_LAB_PROVISIONAL' }
}, { timestamps: true });

// =========================================================================
// 2. LEGACY HARDWARE ALLOCATION MAPPING SCHEMA
// =========================================================================
const HardwareSlotSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    assignedZone: { type: String, required: true },
    alertThresholdPreference: { type: Number, required: true, default: 0.60 }
}, { timestamps: true });

// =========================================================================
// 3. LEGACY TELEMETRY VIOLATION RECORD SCHEMA
// =========================================================================
const TelemetryLogSchema = new mongoose.Schema({
    timestamp: { type: String, required: true },
    slotUid: { type: String, required: true },
    memberName: { type: String, required: true },
    monitoredContext: { type: String, required: true },
    exposureLevel: { type: String, required: true }
}, { timestamps: true });

// =========================================================================
// 4. NEUROCITY AI: UNIVERSAL SUBJECT SCHEMA (Human-Centered Core)
// =========================================================================
const SubjectSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    profileCategory: {
        type: String,
        required: true,
        enum: ['Developmental/ASD', 'Academic', 'Clinical/Healthcare', 'Corporate', 'Operator/Driver', 'General'],
        default: 'General'
    },
    age: Number,
    metadata: {
        notes: String,
        assignedCaregiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    baselineMetrics: {
        restingHeartRate: { type: Number, default: 70 },
        restingGSR: { type: Number, default: 10 }
    }
}, { timestamps: true });

// =========================================================================
// 5. NEUROCITY AI: TIME-SERIES MULTI-MODAL TELEMETRY SCHEMA
// =========================================================================
const TelemetrySchema = new mongoose.Schema({
    subjectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject', 
        required: true, 
        index: true 
    },
    metrics: {
        heartRate: { type: Number, required: true },
        hrv: { type: Number, required: true },          
        skinConductance: { type: Number, required: true }, 
        temperature: { type: Number },
        motionData: {
            accelerometerX: Number,
            accelerometerY: Number,
            accelerometerZ: Number
        }
    },
    aiAnalysis: {
        stressScore: { type: Number, min: 0, max: 100, required: true }, 
        stressLevel: { 
            type: String, 
            enum: ['Calm', 'Mild Stress', 'Moderate Stress', 'High Stress'], 
            required: true 
        },
        emotionalTrend: { type: String }, 
        insights: [{ type: String }],     
        recommendations: [{ type: String }] 
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, { timestamps: true });

// Compound index optimized for ultra-fast time-series data trend lookups
TelemetrySchema.index({ subjectId: 1, timestamp: -1 });

// =========================================================================
// CENTRAL EXPORTS MODULE
// =========================================================================
module.exports = {
    User: mongoose.model('User', UserSchema),
    HardwareSlot: mongoose.model('HardwareSlot', HardwareSlotSchema),
    TelemetryLog: mongoose.model('TelemetryLog', TelemetryLogSchema),
    Subject: mongoose.model('Subject', SubjectSchema),
    Telemetry: mongoose.model('Telemetry', TelemetrySchema)
};