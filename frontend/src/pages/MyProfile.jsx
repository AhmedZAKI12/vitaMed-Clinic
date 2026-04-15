import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {

const { backendUrl, token } = useContext(AppContext)

const [userData, setUserData] = useState(null)
const [isEdit, setIsEdit] = useState(false)
const [image, setImage] = useState(null)
const [loading, setLoading] = useState(false)

const [phoneError, setPhoneError] = useState("")
const [phoneValid, setPhoneValid] = useState(false)

const phoneRegex = /^(010|011|012|015)[0-9]{8}$/

// ================= GET PROFILE =================
const getProfile = async () => {

try {

const { data } = await axios.get(
backendUrl + '/api/user/get-profile',
{ headers: { token } }
)

if (data.success) {
setUserData(data.userData)

if (phoneRegex.test(data.userData.phone)) {
setPhoneValid(true)
}

}

} catch (error) {

console.log(error)
toast.error(error.message)

}

}

// ================= PHONE VALIDATION =================
const handlePhoneChange = (value) => {

if (!/^[0-9]*$/.test(value)) return

setUserData({ ...userData, phone: value })

if (value.length === 0) {
setPhoneError("")
setPhoneValid(false)
return
}

if (value.length < 11) {
setPhoneError("Phone must be 11 digits")
setPhoneValid(false)
return
}

if (!phoneRegex.test(value)) {
setPhoneError("Invalid Egyptian phone number")
setPhoneValid(false)
return
}

setPhoneError("")
setPhoneValid(true)

}

// ================= UPDATE PROFILE =================
const updateProfile = async () => {

if (!phoneValid) {
toast.error("Please enter a valid Egyptian phone number")
return
}

try {

setLoading(true)

const formData = new FormData()

formData.append('name', userData.name)
formData.append('phone', userData.phone)
formData.append('dob', userData.dob)
formData.append('gender', userData.gender)
formData.append('address', JSON.stringify(userData.address))

if (image) formData.append('image', image)

const { data } = await axios.post(
backendUrl + '/api/user/update-profile',
formData,
{ headers: { token } }
)

if (data.success) {
toast.success(data.message)
setIsEdit(false)
getProfile()
}

setLoading(false)

} catch (error) {

console.log(error)
toast.error(error.message)
setLoading(false)

}

}

useEffect(() => {

if (token) {
getProfile()
}

}, [token])

if (!userData) return null

// ================= PROFILE COMPLETION =================
const completion =
(userData.phone ? 25 : 0) +
(userData.gender ? 25 : 0) +
(userData.dob ? 25 : 0) +
(userData.image ? 25 : 0)

return (

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">

<div className="relative w-full max-w-md">

{/* Glow */}
<div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>

<div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-7 text-center transition duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-fadeIn">

{/* IMAGE */}
<div className="relative mx-auto w-28 h-28 group">

<img
src={image ? URL.createObjectURL(image) : userData.image}
className="w-28 h-28 rounded-full object-cover border-4 border-blue-300 transition duration-300 group-hover:scale-110"
/>

{isEdit && (

<label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center gap-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition">

📷
<span className="text-xs">Change</span>

<input
type="file"
hidden
onChange={(e) => setImage(e.target.files[0])}
/>

</label>

)}

</div>

{/* NAME */}
<h2 className="text-2xl font-bold mt-4 text-gray-800 tracking-tight">
{userData.name}
</h2>

<p className="text-gray-500 text-sm mb-4">
{userData.email}
</p>

{/* PROFILE COMPLETION */}
<div className="mb-6 text-left">

<div className="flex justify-between text-xs mb-1 text-gray-500">
<span>Profile Completion</span>
<span>{completion}%</span>
</div>

<div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">

<div
className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all duration-700"
style={{ width: `${completion}%` }}
/>

</div>

</div>

{/* EDIT BUTTON */}
<button
onClick={() => setIsEdit(!isEdit)}
className="mb-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow hover:scale-105 hover:shadow-lg transition"
>
{isEdit ? "Cancel" : "Edit Profile"}
</button>

{/* FORM */}
<div className="space-y-4 text-left">

{/* PHONE */}
<div className="relative">

<input
disabled={!isEdit}
value={userData.phone || ""}
onChange={(e) => handlePhoneChange(e.target.value)}
placeholder="Phone (010xxxxxxxx)"
className={`w-full border p-2 rounded-lg outline-none transition pr-10
${phoneError ? "border-red-400" : "border-gray-300"}
focus:ring-2 focus:ring-blue-400`}
/>

{phoneValid && (
<span className="absolute right-3 top-2.5 text-green-500 font-bold">
✓
</span>
)}

{phoneError && (
<p className="text-red-500 text-xs mt-1">
{phoneError}
</p>
)}

</div>

{/* EMAIL */}
<input
disabled
value={userData.email}
className="w-full border p-2 rounded-lg bg-gray-100"
/>

{/* GENDER */}
<select
disabled={!isEdit}
value={userData.gender || ""}
onChange={(e) =>
setUserData({ ...userData, gender: e.target.value })
}
className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
>

<option value="">Select Gender</option>
<option>Male</option>
<option>Female</option>

</select>

{/* DOB */}
<input
type="date"
disabled={!isEdit}
value={userData.dob || ""}
onChange={(e) =>
setUserData({ ...userData, dob: e.target.value })
}
className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
/>

</div>

{/* SAVE BUTTON */}
{isEdit && (

<button
onClick={updateProfile}
disabled={loading}
className={`mt-6 w-full py-2 rounded-full text-white transition transform
${loading
? "bg-gray-400 cursor-not-allowed"
: "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.04]"
}`}
>

{loading ? "Saving..." : "Save Changes"}

</button>

)}

</div>

</div>

</div>

)
}

export default MyProfile