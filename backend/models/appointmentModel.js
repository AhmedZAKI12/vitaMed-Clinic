import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
{
    userId: { type: String, required: true },
    docId: { type: String, required: true },

    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },

    userData: { type: Object, required: true },
    docData: { type: Object, required: true },

    amount: { type: Number, required: true },
    date: { type: Number, required: true },

    // 👇 الحالة
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending",
    },

    // 👇 القديم (سيبه زي ما هو)
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },

    // =========================
    // ⭐ Review System
    // =========================

    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },

    review: {
        type: String,
        default: ""
    },

    isRated: {
        type: Boolean,
        default: false
    },

    reminderSent: {
        type: Boolean,
        default: false
    }

},
{ timestamps: true }
);

// ⭐⭐ أهم سطر لمنع الحجز في نفس الوقت
appointmentSchema.index(
    { docId: 1, slotDate: 1, slotTime: 1 },
    { unique: true }
)

const appointmentModel =
mongoose.models.appointment ||
mongoose.model("appointment", appointmentSchema);

export default appointmentModel;