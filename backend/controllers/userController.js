import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import { sendEmail } from "../utils/sendEmail.js";

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing Details' })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Weak password" })
    }

    const existingUser = await userModel.findOne({ email })

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
    }).save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.json({ success: true, token })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.json({ success: false, message: "Wrong password" })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.json({ success: true, token })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


// ================= PROFILE =================
const getProfile = async (req, res) => {
  try {

    const { userId } = req.body

    const userData = await userModel
      .findById(userId)
      .select('-password')

    res.json({ success: true, userData })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


const updateProfile = async (req, res) => {
  try {

    const { userId, name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender
    })

    if (imageFile) {

      const upload = await cloudinary.uploader.upload(imageFile.path)

      await userModel.findByIdAndUpdate(userId, {
        image: upload.secure_url
      })

    }

    res.json({ success: true, message: 'Updated' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


// ================= BOOK APPOINTMENT =================
const bookAppointment = async (req, res) => {
  try {

    const { userId, docId, slotDate, slotTime } = req.body

    if (!userId || !docId || !slotDate || !slotTime) {
      return res.json({ success: false, message: "Missing booking data" })
    }

    const docData = await doctorModel.findById(docId)

    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" })
    }

    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' })
    }

    // منع الحجز المكرر
    const existingAppointment = await appointmentModel.findOne({
      docId,
      slotDate,
      slotTime,
      cancelled: { $ne: true }
    })

    if (existingAppointment) {
      return res.json({ success: false, message: "Slot already booked" })
    }

    const userData = await userModel.findById(userId).select("-password")

    const appointment = new appointmentModel({
      userId,
      docId,
      userData,
      docData,
      slotDate,
      slotTime,
      amount: docData.fees,
      date: Date.now()
    })

    await appointment.save()


    // ================= EMAIL NOTIFICATIONS =================

    // ايميل للمريض
    await sendEmail(
      userData.email,
      "Appointment Booked - VitaMed Clinic",
      `Hello ${userData.name},

Your appointment has been booked successfully.

Doctor: ${docData.name}
Date: ${slotDate}
Time: ${slotTime}

Thank you for choosing VitaMed Clinic.`
    )

    // ايميل للدكتور
    await sendEmail(
      docData.email,
      "New Appointment Booked - VitaMed Clinic",
      `Hello Dr. ${docData.name},

A new appointment has been booked.

Patient: ${userData.name}
Date: ${slotDate}
Time: ${slotTime}

Please check your dashboard for more details.`
    )


    // تحديث slots_booked للحفاظ على التوافق مع باقي المشروع
    let slots = docData.slots_booked || {}

    if (!slots[slotDate]) slots[slotDate] = []

    slots[slotDate].push(slotTime)

    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slots })

    res.json({ success: true, message: 'Booked' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


// ================= CANCEL =================
const cancelAppointment = async (req, res) => {

  try {

    const { userId, appointmentId } = req.body

    const appointment = await appointmentModel.findById(appointmentId)

    if (!appointment) {
      return res.json({
        success: false,
        message: "Appointment not found"
      })
    }

    if (appointment.userId.toString() !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized"
      })
    }

    // تحديث حالة الموعد
    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { cancelled: true }
    )

    // ========================
    // إعادة فتح الموعد
    // ========================

    const doctor = await doctorModel.findById(appointment.docId)

    let slots_booked = doctor.slots_booked || {}

    const slotDate = appointment.slotDate
    const slotTime = appointment.slotTime

    if (slots_booked[slotDate]) {

      slots_booked[slotDate] =
        slots_booked[slotDate].filter(
          time => time !== slotTime
        )

      // لو اليوم أصبح فارغ نحذفه
      if (slots_booked[slotDate].length === 0) {
        delete slots_booked[slotDate]
      }

    }

    await doctorModel.findByIdAndUpdate(
      appointment.docId,
      { slots_booked }
    )



    // ================= EMAIL NOTIFICATION =================

    const user = await userModel.findById(userId)

    await sendEmail(
      doctor.email,
      "Appointment Cancelled by Patient - VitaMed Clinic",
      `Hello Dr. ${doctor.name},

The patient has cancelled the appointment.

Patient: ${user.name}
Date: ${appointment.slotDate}
Time: ${appointment.slotTime}

The time slot is now available for booking.

VitaMed Clinic`
    )

    res.json({
      success: true,
      message: "Appointment cancelled"
    })


  } catch (error) {

    console.log(error)

    res.json({
      success: false,
      message: error.message
    })

  }

}




// ================= LIST =================
const listAppointment = async (req, res) => {
  try {

    const { userId } = req.body

    const appointments = await appointmentModel
      .find({ userId })
      .sort({ date: -1 })

    res.json({ success: true, appointments })

  } catch (error) {
    console.log(error)
    res.json({ success: false })
  }
}



// ================= RATE DOCTOR =================
const rateDoctor = async (req, res) => {
  try {

    const { userId, docId, rating, review } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Invalid rating" })
    }

    // نجيب آخر موعد مكتمل ولم يتم تقييمه
    const appointment = await appointmentModel.findOne({
      userId,
      docId,
      isCompleted: true,
      isRated: false
    }).sort({ date: -1 })

    if (!appointment) {
      return res.json({ success: false, message: "Already rated" })
    }

    // تسجيل التقييم على هذا الموعد
    appointment.rating = rating
    appointment.review = review
    appointment.isRated = true

    await appointment.save()

    // تحديث تقييم الدكتور
    const doctor = await doctorModel.findById(docId)

    const total = (doctor.rating || 0) * (doctor.numReviews || 0)

    doctor.rating =
      (total + rating) /
      ((doctor.numReviews || 0) + 1)

    doctor.numReviews = (doctor.numReviews || 0) + 1

    await doctor.save()

    res.json({ success: true })

  } catch (error) {
    console.log(error)
    res.json({ success: false })
  }
}



// ================= EXPORT =================
export {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  rateDoctor
}