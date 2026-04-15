import cron from "node-cron"
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"
import doctorModel from "../models/doctorModel.js"
import { sendEmail } from "./sendEmail.js"

const reminderJob = () => {

cron.schedule("*/10 * * * *", async () => {

console.log("Checking appointment reminders...")

try {

const appointments = await appointmentModel.find({
status: "confirmed",
cancelled: false,
isCompleted: false
})

const now = new Date()

for (let appointment of appointments) {

const user = await userModel.findById(appointment.userId)
const doctor = await doctorModel.findById(appointment.docId)

if(!user || !doctor) continue

const [day, month, year] = appointment.slotDate.split("_")

let appointmentDate = new Date(`${year}-${month}-${day} ${appointment.slotTime}`)

const diff = appointmentDate - now

const oneHour = 60 * 60 * 1000

// ⭐ reminder قبل ساعة
if (diff > 0 && diff < oneHour && !appointment.reminderSent) {

await sendEmail(
user.email,
"Appointment Reminder - VitaMed Clinic",
`Hello ${user.name},

Reminder: You have an appointment soon.

Doctor: Dr. ${doctor.name}
Date: ${appointment.slotDate}
Time: ${appointment.slotTime}

Please arrive 10 minutes early.

VitaMed Clinic`
)

appointment.reminderSent = true
await appointment.save()

console.log(`Reminder sent for appointment ${appointment._id}`)

}

}

} catch(error){

console.log("Reminder job error:",error.message)

}

})

}

export default reminderJob