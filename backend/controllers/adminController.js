import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";

// =======================
// ADMIN LOGIN
// =======================
const loginAdmin = async (req, res) => {
try {

const { email, password } = req.body;

if (
email === process.env.ADMIN_EMAIL &&
password === process.env.ADMIN_PASSWORD
) {

const token = jwt.sign(
{ role: "admin" },
process.env.JWT_SECRET,
{ expiresIn: "1d" }
);

return res.json({ success: true, token });

}

return res.json({
success: false,
message: "Invalid credentials",
});

} catch (error) {

res.json({ success: false, message: error.message });

}
};

// =======================
// GET ALL DOCTORS
// =======================
const getAllDoctors = async (req, res) => {
try {

const doctors = await doctorModel.find({});
res.json({ success: true, doctors });

} catch (error) {

res.json({ success: false, message: error.message });

}
};

// =======================
// DELETE DOCTOR
// =======================
const deleteDoctor = async (req, res) => {
try {

const { id } = req.params;

await doctorModel.findByIdAndDelete(id);

res.json({
success: true,
message: "Doctor deleted successfully",
});

} catch (error) {

res.json({ success: false, message: error.message });

}
};

// =======================
// CHANGE AVAILABILITY
// =======================
const changeAvailability = async (req, res) => {
try {

const { docId } = req.body;

const doctor = await doctorModel.findById(docId);

doctor.available = !doctor.available;

await doctor.save();

res.json({
success: true,
message: "Availability updated",
});

} catch (error) {

res.json({ success: false, message: error.message });

}
};

// =======================
// DASHBOARD DATA
// =======================
const getDashboardData = async (req, res) => {
try {

const doctors = await doctorModel.countDocuments();
const appointments = await appointmentModel.countDocuments();
const patients = await userModel.countDocuments();

const latestAppointments = await appointmentModel
.find({})
.sort({ createdAt: -1 })
.limit(5);

res.json({
success: true,
dashData: {
doctors,
appointments,
patients,
latestAppointments,
},
});

} catch (error) {

res.json({ success: false, message: error.message });

}
};

// =======================
// GET ALL APPOINTMENTS
// =======================
const getAllAppointments = async (req, res) => {
try {

const appointments = await appointmentModel.find({});
res.json({ success: true, appointments });

} catch (error) {

res.json({ success: false, message: error.message });

}
};

// =======================
// CANCEL APPOINTMENT (ADMIN)
// =======================
const cancelAppointment = async (req, res) => {
try {

const { appointmentId } = req.body;

const appointment = await appointmentModel.findById(appointmentId);

await appointmentModel.findByIdAndUpdate(appointmentId, {
cancelled: true,
status: "cancelled"
});

const user = await userModel.findById(appointment.userId);
const doctor = await doctorModel.findById(appointment.docId);

// EMAIL
await sendEmail(
user.email,
"Appointment Cancelled - VitaMed Clinic",
`Hello ${user.name},

Your appointment has been cancelled by the clinic.

Doctor: Dr. ${doctor.name}
Date: ${appointment.slotDate}
Time: ${appointment.slotTime}

Please book another appointment if needed.

VitaMed Clinic`
);

res.json({
success: true,
message: "Appointment cancelled",
});

} catch (error) {

res.json({ success: false, message: error.message });

}
};

// =======================
// UPDATE APPOINTMENT STATUS
// =======================
const updateAppointmentStatus = async (req, res) => {
try {

const { appointmentId, status } = req.body;

const appointment = await appointmentModel.findById(appointmentId);

const allowedStatus = ["pending", "confirmed", "completed", "cancelled"];

if (!allowedStatus.includes(status)) {
return res.json({ success: false, message: "Invalid status" });
}

await appointmentModel.findByIdAndUpdate(appointmentId, {
status,
cancelled: status === "cancelled",
isCompleted: status === "completed",
});

const user = await userModel.findById(appointment.userId);
const doctor = await doctorModel.findById(appointment.docId);

// EMAIL
await sendEmail(
user.email,
"Appointment Status Updated - VitaMed Clinic",
`Hello ${user.name},

Your appointment status has been updated.

Doctor: Dr. ${doctor.name}
Status: ${status}

VitaMed Clinic`
);

res.json({ success: true, message: "Appointment status updated" });

} catch (error) {

res.json({ success: false, message: error.message });

}
};

// =======================
// COMPLETE APPOINTMENT
// =======================
const completeAppointment = async (req, res) => {
try {

const { appointmentId } = req.body;

const appointment = await appointmentModel.findById(appointmentId);

await appointmentModel.findByIdAndUpdate(appointmentId, {
isCompleted: true,
status: "completed"
});

const user = await userModel.findById(appointment.userId);
const doctor = await doctorModel.findById(appointment.docId);

// EMAIL
await sendEmail(
user.email,
"Appointment Completed - VitaMed Clinic",
`Hello ${user.name},

Your appointment has been completed successfully.

Doctor: Dr. ${doctor.name}

Thank you for visiting VitaMed Clinic.
We wish you good health.`
);

res.json({
success: true,
message: "Appointment marked as completed",
});

} catch (error) {

res.json({ success: false, message: error.message });

}
};

// =======================
// ADD DOCTOR
// =======================
const addDoctor = async (req, res) => {
try {

const {
name,
email,
phone,
password,
speciality,
degree,
experience,
fees,
address,
about,
} = req.body;

if (!name || !email || !phone || !password || !speciality) {
return res.json({
success: false,
message: "Missing required fields",
});
}

const image = req.file;

if (!image) {
return res.json({
success: false,
message: "Doctor image is required",
});
}

const existingDoctor = await doctorModel.findOne({ email });

if (existingDoctor) {
return res.json({
success: false,
message: "Doctor already exists",
});
}

const hashedPassword = await bcrypt.hash(password, 10);

const uploadResult = await cloudinary.uploader.upload(image.path,{
folder:"doctors"
});

const newDoctor = new doctorModel({
name,
email,
phone,
password: hashedPassword,
speciality,
degree,
experience,
fees,
address,
about,
image: uploadResult.secure_url,
available: true,
slots_booked: {},
});

await newDoctor.save();

res.json({
success: true,
message: "Doctor added successfully",
});

} catch (error) {

console.log(error);

res.json({
success: false,
message: error.message,
});

}
};

// =======================
// EXPORTS
// =======================
export {
loginAdmin,
getAllDoctors,
deleteDoctor,
changeAvailability,
getDashboardData,
getAllAppointments,
cancelAppointment,
updateAppointmentStatus,
completeAppointment,
addDoctor,
};