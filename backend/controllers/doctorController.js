import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import medicalRecordModel from "../models/medicalRecordModel.js";

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
        const  docId  = req.docId; // جاي من authdoctor
        const appointments = await appointmentModel.find({ docId }).sort({ date: -1 });
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

        const docId = req.docId; // جاي من authDoctor
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        // 🔴 check exists
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // 🔴 check ownership
        if (appointmentData.docId.toString() !== docId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // ✅ cancel appointment
        await appointmentModel.findByIdAndUpdate(appointmentId, {
            cancelled: true,
            status: "cancelled"
        });

        // ✅ send email
        const user = await userModel.findById(appointmentData.userId).select("email name");
        const doctor = await doctorModel.findById(docId).select("name");
if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
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
        );

        return res.json({
            success: true,
            message: "Appointment Cancelled"
        });

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

        const docId = req.docId; // جاي من authDoctor
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        // 🔴 check exists
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // 🔴 check ownership
        if (appointmentData.docId.toString() !== docId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // ✅ confirm appointment
        await appointmentModel.findByIdAndUpdate(appointmentId, {
            status: "confirmed"
        });

        // ✅ send email
        const user = await userModel.findById(appointmentData.userId);
        const doctor = await doctorModel.findById(docId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

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
        );

        return res.json({
            success: true,
            message: "Appointment Confirmed"
        });

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

        const docId = req.docId; // جاي من authDoctor
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        // 🔴 1) Check if appointment exists
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // 🔴 2) Check ownership
        if (appointmentData.docId.toString() !== docId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // ✅ 3) Update appointment
        await appointmentModel.findByIdAndUpdate(appointmentId, {
            isCompleted: true,
            status: "completed"
        });


// ================= CREATE MEDICAL RECORD =================


const existingRecord = await medicalRecordModel.findOne({
    appointmentId: appointmentId
});

if (!existingRecord) {
    await medicalRecordModel.create({
        patientId: appointmentData.userId,
        doctorId: appointmentData.docId,
        appointmentId: appointmentId,
        diagnosis: "Pending",
        prescription: "Pending",
        followUpRequired: true,
        updates: [],
        doctorReplies: []
    });
}


        // ✅ 4) Update doctor slots
        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked || {};

        const slotDate = appointmentData.slotDate;
        const slotTime = appointmentData.slotTime;

        if (slots_booked[slotDate]) {

            slots_booked[slotDate] =
                slots_booked[slotDate].filter(time => time !== slotTime);

            if (slots_booked[slotDate].length === 0) {
                delete slots_booked[slotDate];
            }
        }

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        // ✅ 5) Send email
        const user = await userModel.findById(appointmentData.userId);
        const doctor = await doctorModel.findById(docId);

        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        await sendEmail(
            user.email,
            "Appointment Completed - VitaMed Clinic",
`Hello ${user.name},

Your appointment has been completed successfully.

Doctor: Dr. ${doctor.name}

Thank you for visiting VitaMed Clinic.
We wish you good health.`
        );

        // ✅ 6) Final response
        return res.json({
            success: true,
            message: "Appointment Completed and slot reopened"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
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
        const  docId  = req.docId; // جاي من authdoctor
        
        const docData = await doctorModel.findById(docId);
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }

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
        const  docId  = req.docId; // جاي من authdoctor
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
        const  docId  = req.docId; // جاي من authdoctor
        const { fees, address, available } = req.body;

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
        const  docId  = req.docId; // جاي من authdoctor
        const appointments = await appointmentModel.find({ docId }).sort({ date: -1 });

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
            latestAppointments: [...appointments]
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




    //medical record
    const addMedicalRecord = async (req, res) => {
    try {
        const { appointmentId, diagnosis, prescription, followUpRequired, followUpDate } = req.body;

        // ✅ استخدم الاسم الصح
        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
            }
            if(appointment.docId.toString() !== req.docId){
                return res.json({ success: false, message: "Unauthorized" });
            }
            

        // ✅ منع التكرار
        const existing = await medicalRecordModel.findOne({ appointmentId });

        if (existing) {
            return res.json({
                success: false,
                message: "Medical record already exists"
            });
        }

        const newRecord = new medicalRecordModel({
            patientId: appointment.userId,
            doctorId: appointment.docId,
            appointmentId,
            diagnosis,
            prescriptions: [
                {
                    text: prescription
                }
            ],
            followUpRequired,
            followUpDate
        });

        await newRecord.save();

        res.json({ success: true, message: "Medical record added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
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
// =======================Get Follow-up Updates
    const getFollowUpUpdates = async (req, res) => {
    try {

        const { recordId } = req.body;

        // check
        if (!recordId) {
        return res.json({
            success: false,
            message: "recordId is required"
        });
        }

        const record = await medicalRecordModel.findOne({
        _id: recordId,
        doctorId: req.docId
        });

        if (!record) {
        return res.json({
            success: false,
            message: "Record not found"
        });
        }

        res.json({
        success: true,
        updates: record.updates,
        replies: record.doctorReplies
        });

    } catch (error) {
        res.json({
        success: false,
        message: error.message
        });
    }
    };


// ======================= Reply to Follow-up
    const replyToFollowUp = async (req, res) => {
    try {
        const { recordId, message,prescription  } = req.body;

        console.log("Replying to record:", recordId, "with message:", message, "and prescription:", prescription); // 🔥 debug

        const record = await medicalRecordModel
            .findById(recordId)
            .populate("patientId", "name email") // 🔥 دي مهمة

        if (!record) {
            return res.json({
                success: false,
                message: "Record not found"
            });
        }

        // ✅ save reply
        record.doctorReplies.push({ message });
        record.status = "active";

        if(prescription){
            record.prescriptions.push({ text: prescription });
        }
        

        await record.save();

        // ✅ user جاهز مباشرة
        const user = record.patientId;

        // ✅ doctor
        const doctor = await doctorModel.findById(record.doctorId);

        if (user && doctor) {
            await sendEmail(
                user.email,
                "Reply from your doctor - VitaMed Clinic",
`Hello ${user.name},
your doctor has responded to your follow-up inquiry.

${doctor.name} has replied to your follow-up:

✉ message:
"${message}"
Please log in to your account to view the full details and respond if necessary.


stay safe and healthy!
Thank you,

VitaMed Clinic`
            );
        }

        res.json({
            success: true,
            message: "Reply added and email sent"
        });

    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Error"
        });
    }
};




// ======================= Get Doctor's Medical Records
    const getDoctorRecords = async (req, res) => {
    try {
        const docId = req.docId;

        const records = await medicalRecordModel
            .find({ doctorId: docId })
            .populate("patientId", "name email") // جلب بيانات المريض (الاسم والبريد الإلكتروني)    
            .sort({ createdAt: -1 });
            console.log("Doctor Records:", records); // 🔥 debug

        res.json({
            success: true,
            records
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};




// ======================= Get Single Medical Record (with auth check)



const getSingleRecord = async (req, res) => {
    try {

        const { id } = req.params

        const record = await medicalRecordModel.findOne({
            _id: id,
            doctorId: req.docId
        })

        if (!record) {
            return res.json({
                success: false,
                message: "Record not found or unauthorized"
            })
        }

        res.json({
            success: true,
            record
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
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
    addMedicalRecord,
    getDoctorReviews,
    getFollowUpUpdates,
    replyToFollowUp,
    getDoctorRecords,
    getSingleRecord
};