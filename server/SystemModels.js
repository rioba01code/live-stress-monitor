const mongoose = require('mongoose');

// =========================================================================
// MONGO_DB PERSISTENT SCHEMA INFRASTRUCTURE
// =========================================================================

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, default: 'Kenya' },
  status: { type: String, default: 'VERIFIED_LAB_PROVISIONAL' },
  createdAt: { type: Date, default: Date.now }
});

const HardwareSlotSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  assignedZone: { type: String, required: true },
  alertThresholdPreference: { type: Number, required: true, default: 0.70 }
});

const TelemetryLogSchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  slotUid: { type: String, required: true, index: true },
  memberName: { type: String, required: true },
  monitoredContext: { type: String, required: true },
  exposureLevel: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '30d' } // Automated Time-To-Live background pruning
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  HardwareSlot: mongoose.model('HardwareSlot', HardwareSlotSchema),
  TelemetryLog: mongoose.model('TelemetryLog', TelemetryLogSchema)
};