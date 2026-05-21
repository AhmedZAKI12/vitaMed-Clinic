import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({

    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentId: { type: String, required: true, unique: true },

    diagnosis: { type: String, default: "" },
        prescriptions: [
    {
        text: { type: String },
        createdAt: { type: Date, default: Date.now }
    }
    ],
    // =========================
    // Follow-up Setup
    // =========================
    followUpRequired: {
        type: Boolean,
        default: false
    },

    followUpDate: {
        type: Date
    },

    reminderSent: {
        type: Boolean,
        default: false
    },

    // =========================
    // Patient Updates
    // =========================
    updates: [
        {
            painLevel: { type: Number, min: 1, max: 10 },
            symptoms: { type: String },
            notes: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ],

    // =========================
    // Doctor Replies
    // =========================
    doctorReplies: [
        {
            message: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ],

status: {
        type: String,
        enum: ['pending', 'active', 'closed'],
        default: 'pending'
    },


}, { timestamps: true });

const medicalRecordModel =
    mongoose.models.MedicalRecord ||
    mongoose.model("MedicalRecord", medicalRecordSchema);

export default medicalRecordModel;