import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";

// =======================
// API for Doctor Login
// =======================
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await doctorModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// =======================
// Get Doctor Appointments
// =======================
const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// =======================
// Cancel Appointment
// =======================
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {
                cancelled: true,
                status: "cancelled"
            });

            const user = await userModel.findById(appointmentData.userId)
            const doctor = await doctorModel.findById(docId)

            // EMAIL
            await sendEmail(
                user.email,
                "Appointment Cancelled - VitaMed Clinic",
`Hello ${user.name},

Your appointment has been cancelled by the doctor.

Doctor: Dr. ${doctor.name}
Date: ${appointmentData.slotDate}
Time: ${appointmentData.slotTime}

Please book another appointment if needed.

VitaMed Clinic`
            )

            return res.json({ success: true, message: "Appointment Cancelled" });
        }

        res.json({ success: false, message: "Appointment not found" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// =======================
// CONFIRM Appointment
// =======================
const appointmentConfirm = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {
                status: "confirmed"
            });

            const user = await userModel.findById(appointmentData.userId)
            const doctor = await doctorModel.findById(docId)

            await sendEmail(
                user.email,
                "Appointment Confirmed - VitaMed Clinic",
`Hello ${user.name},

Your appointment has been confirmed.

Doctor: Dr. ${doctor.name}
Date: ${appointmentData.slotDate}
Time: ${appointmentData.slotTime}

Please arrive 10 minutes before your appointment.

Thank you,
VitaMed Clinic`
            )

            return res.json({ success: true, message: "Appointment Confirmed" });
        }

        res.json({ success: false, message: "Appointment not found" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// =======================
// Complete Appointment
// =======================
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {
                isCompleted: true,
                status: "completed"
            });

            const doctorData = await doctorModel.findById(docId)

            let slots_booked = doctorData.slots_booked || {}

            const slotDate = appointmentData.slotDate
            const slotTime = appointmentData.slotTime

            if (slots_booked[slotDate]) {

                slots_booked[slotDate] = slots_booked[slotDate].filter(
                    time => time !== slotTime
                )

                if (slots_booked[slotDate].length === 0) {
                    delete slots_booked[slotDate]
                }
            }

            await doctorModel.findByIdAndUpdate(docId, { slots_booked })

            const user = await userModel.findById(appointmentData.userId)
            const doctor = await doctorModel.findById(docId)

            // EMAIL
            await sendEmail(
                user.email,
                "Appointment Completed - VitaMed Clinic",
`Hello ${user.name},

Your appointment has been completed successfully.

Doctor: Dr. ${doctor.name}

Thank you for visiting VitaMed Clinic.
We wish you good health.`
            )

            return res.json({
                success: true,
                message: "Appointment Completed and slot reopened"
            })
        }

        res.json({ success: false, message: "Appointment not found" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
};








// =======================
// Doctors List (Frontend)
// =======================
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(["-password", "-email"]);
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// =======================
// Change Availability
// =======================
const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await doctorModel.findById(docId);

        await doctorModel.findByIdAndUpdate(docId, {
            available: !docData.available
        });

        res.json({ success: true, message: "Availability Changed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// =======================
// Doctor Profile
// =======================
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body;
        const profileData = await doctorModel.findById(docId).select("-password");
        res.json({ success: true, profileData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// =======================
// Update Doctor Profile
// =======================
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available } = req.body;

        await doctorModel.findByIdAndUpdate(docId, {
            fees,
            address,
            available
        });

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// =======================
// Doctor Dashboard
// =======================
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId });

        let earnings = 0;
        let patients = [];

        appointments.forEach(item => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
            if (!patients.includes(item.userId)) {
                patients.push(item.userId);
            }
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
//recommenddoctor
    const getRecommendedDoctor = async (req, res) => {
    try {
        const { speciality } = req.query

        if (!speciality) {
            return res.json({
                success: false,
                message: "Speciality is required"
            })
        }

        // 1. نجيب دكاترة بنفس التخصص ومتاحة
        const doctors = await doctorModel.find({
            speciality: speciality,
            available: true
        }).select("-password")

        if (!doctors.length) {
            return res.json({
                success: false,
                message: "No doctors found for this speciality"
            })
        }

        // 2. نحسب score لكل دكتور
        let bestDoctor = doctors[0]
        let bestScore = 0

        for (let doc of doctors) {

            const rating = doc.rating || 0

            // const load = Object.keys(doc.slots_booked || {}).length

            // المعادلة (تقدر تقولها للدكتور 😎)
            const experience = Number(doc.experience) || 0
const load = Object.keys(doc.slots_booked || {}).length

// ⭐ معادلة ذكية
const score = (rating * 3) + (experience * 1.5) - load

            if (score > bestScore) {
                bestScore = score
                bestDoctor = doc
            }
        }

        res.json({
            success: true,
            doctor: bestDoctor
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



// getDoctorReviews
const getDoctorReviews = async (req, res) => {
    try {

        const { docId } = req.params

        // نجيب كل التقييمات المرتبطة بالدكتور
        const reviews = await appointmentModel
        .find({
            docId,
            isRated: true
        })
        .sort({ date: -1 }) // 🔥 أحدث تقييم يظهر أولاً

        // تجهيز البيانات للفرونت
        const formattedReviews = reviews.map(item => ({
            rating: item.rating,
            review: item.review,
            userName: item.userData?.name || "Patient",
            date: item.date
        }))

        // حساب متوسط التقييم
        let avgRating = 0

        if (reviews.length > 0) {

            const total = reviews.reduce(
                (sum,item)=> sum + item.rating,
                0
            )

            avgRating = (total / reviews.length).toFixed(1)
        }

        res.json({
            success: true,
            reviews: formattedReviews,
            avgRating
        })

    } catch (error) {

        console.log(error)

        res.json({
            success:false,
            message:error.message
        })
    }
}





// =======================
// EXPORTS
// =======================
export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    appointmentConfirm, 
    appointmentComplete,
    getRecommendedDoctor,
    doctorList,
    changeAvailablity,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    getDoctorReviews
};