import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {

const { backendUrl, token, getDoctosData } = useContext(AppContext)

const [appointments, setAppointments] = useState([])
const [userRatings, setUserRatings] = useState({})
const [reviews, setReviews] = useState({})

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

const slotDateFormat = (slotDate) => {
const dateArray = slotDate.split('_')
return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
}

// =========================
// GET USER APPOINTMENTS
// =========================
const getUserAppointments = async () => {

try {

const { data } = await axios.get(
backendUrl + '/api/user/appointments',
{ headers: { token } }
)

if (data.success) {

const sortedAppointments = data.appointments.sort(
(a,b) => b.date - a.date
)

setAppointments(sortedAppointments)

}

} catch (error) {
toast.error(error.message)
}

}

// =========================
// CANCEL APPOINTMENT
// =========================
const cancelAppointment = async (appointmentId) => {

try {

const { data } = await axios.post(
backendUrl + '/api/user/cancel-appointment',
{ appointmentId },
{ headers: { token } }
)

if (data.success) {
toast.success(data.message)
getUserAppointments()
getDoctosData() // تحديث بيانات الأطباء بعد إلغاء الموعد    
}

} catch (error) {
toast.error(error.message)
}

}

// =========================
// RATE DOCTOR
// =========================
const rateDoctor = async (docId) => {

const rating = userRatings[docId]
const review = reviews[docId]

if (!rating) return toast.error("Select rating ⭐")
if (!review) return toast.error("Write review 📝")

try {

const { data } = await axios.post(
backendUrl + "/api/user/rate-doctor",
{ docId, rating, review },
{ headers: { token } }
)

if (data.success) {

toast.success("Review submitted ✅")

setUserRatings(prev => ({
...prev,
[docId]: "done"
}))

} else {
toast.error(data.message)
}

} catch (error) {
toast.error("Error")
}

}

useEffect(() => {
if (token) getUserAppointments()
}, [token])

return (

<div className='max-w-6xl mx-auto px-4'>

<h2 className='text-3xl font-bold mb-8 text-gray-800'>
My Appointments
</h2>

<div className='space-y-6'>

{appointments.map((item,index) => {

const isDone =
userRatings[item.docData._id] === "done" || item.isRated

return (

<div
key={index}
className='bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row gap-6 hover:shadow-xl transition'
>

{/* IMAGE */}
<img
className='w-24 h-24 rounded-xl object-cover bg-[#EAEFFF]'
src={item.docData.image}
alt=""
/>

{/* INFO */}
<div className='flex-1'>

<p className='text-lg font-semibold'>
{item.docData.name}
</p>

<p className='text-gray-500'>
{item.docData.speciality}
</p>

<p className='text-sm text-gray-400 mt-1'>
📅 {slotDateFormat(item.slotDate)} | ⏰ {item.slotTime}
</p>

</div>

{/* ACTION */}
<div className='w-full md:w-72'>

{/* CONFIRMED */}
{item.status === "confirmed" && !item.isCompleted && (

<div className='bg-blue-100 text-blue-600 text-center py-1 rounded-full text-sm mb-3'>
Confirmed by Doctor
</div>

)}

{/* CANCEL */}
{!item.cancelled && !item.isCompleted && (

<button
onClick={() => cancelAppointment(item._id)}
className='w-full py-2 border rounded-lg hover:bg-red-500 hover:text-white transition'
>
Cancel appointment
</button>

)}

{/* COMPLETED */}
{item.isCompleted && (

<div>

<div className='bg-green-100 text-green-600 text-center py-1 rounded-full text-sm mb-3'>
Completed
</div>

{/* REVIEW SECTION */}

<div
className={`transition-all duration-500 ${
isDone
? "opacity-0 h-0 overflow-hidden"
: "opacity-100"
}`}
>

<p className='text-sm text-gray-500 mb-2'>
Rate your experience
</p>

{/* STARS */}

<div className="flex gap-2 mb-3">

{[1,2,3,4,5].map((star) => {

const selected = userRatings[item.docData._id]

return (

<span
key={star}
onClick={() => {

if (selected === "done") return

setUserRatings(prev => ({
...prev,
[item.docData._id]: star
}))

}}
className={`cursor-pointer text-2xl transition transform
${
selected >= star
? "text-yellow-400 scale-110"
: "text-gray-300 hover:text-yellow-400 hover:scale-110"
}`}
>

★

</span>

)

})}

</div>

{/* REVIEW */}

<textarea
placeholder="Write your review..."
className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-400 outline-none"
onChange={(e) =>
setReviews(prev => ({
...prev,
[item.docData._id]: e.target.value
}))
}
/>

{/* BUTTON */}

<button
onClick={() => rateDoctor(item.docData._id)}
className='w-full mt-3 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition'
>

Submit Review

</button>

</div>

{/* AFTER REVIEW */}

{isDone && (

<div className='text-green-600 text-center text-sm mt-2 animate-pulse'>
✅ Review submitted
</div>

)}

</div>

)}

</div>

</div>

)

})}

</div>

</div>

)

}

export default MyAppointments