import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AddDoctor = () => {

const [docImg, setDocImg] = useState(false)
const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [phone, setPhone] = useState("")
const [password, setPassword] = useState("")
const [experience, setExperience] = useState("1 Year")
const [fees, setFees] = useState("")
const [about, setAbout] = useState("")
const [speciality, setSpeciality] = useState("General physician")
const [degree, setDegree] = useState("")
const [address1, setAddress1] = useState("")
const [address2, setAddress2] = useState("")

const { backendUrl } = useContext(AppContext)
const { aToken } = useContext(AdminContext)


/* ================= VALIDATION ================= */

const nameRegex = /^[A-Za-z\s]+$/
const addressRegex = /^(?=.*[A-Za-z])[A-Za-z0-9\s,.-]+$/
const phoneRegex = /^(010|011|012|015)[0-9]{8}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


const onSubmitHandler = async (event) => {

event.preventDefault()

try {

if (!docImg) {
return toast.error("Doctor image is required")
}

/* NAME VALIDATION */

if (!nameRegex.test(name)) {
return toast.error("Doctor name must contain letters only")
}
// PHONE VALIDATION

if (!phoneRegex.test(phone)) {
return toast.error("Phone number must be valid Egyptian number")
}





/* PASSWORD VALIDATION */

if (!passwordRegex.test(password)) {
return toast.error(
"Password must contain 8 characters, uppercase, lowercase, number and symbol"
)
}

// email validation

if (!emailRegex.test(email)) {
return toast.error("Enter a valid email address")
}







/* ADDRESS VALIDATION */

if (!addressRegex.test(address1)) {
return toast.error("Address must contain letters")
}

if (address2 && !addressRegex.test(address2)) {
return toast.error("Address line 2 must contain letters")
}

const formData = new FormData()

formData.append("image", docImg)
formData.append("name", name)
formData.append("email", email)
formData.append("phone", phone)
formData.append("password", password)
formData.append("experience", experience)
formData.append("fees", Number(fees))
formData.append("about", about)
formData.append("speciality", speciality)
formData.append("degree", degree)

formData.append(
"address",
JSON.stringify({
line1: address1,
line2: address2
})
)

const { data } = await axios.post(
backendUrl + "/api/admin/add-doctor",
formData,
{
headers: {
Authorization: `Bearer ${aToken}`,
},
}
)

if (data.success) {

toast.success(data.message)

setDocImg(false)
setName("")
setPassword("")
setEmail("")
setPhone("")
setAddress1("")
setAddress2("")
setDegree("")
setAbout("")
setFees("")

} else {

toast.error(data.message)

}

} catch (error) {

toast.error(error.message)
console.log(error)

}

}


return (

<div className="w-full min-h-screen p-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50">

<h1 className="text-3xl font-bold text-gray-700 mb-8">
Add Doctor
</h1>

<form
onSubmit={onSubmitHandler}
className="max-w-5xl bg-white rounded-2xl shadow-xl p-10 space-y-8 transition hover:shadow-2xl"
>


{/* upload image */}

<div className="flex items-center gap-6">

<label htmlFor="doc-img" className="cursor-pointer group relative">

<img
className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 group-hover:border-blue-500 transition"
src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
/>

<div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
Upload
</div>

</label>

<input
onChange={(e)=>setDocImg(e.target.files[0])}
type="file"
id="doc-img"
hidden
/>

<div>
<p className="font-semibold text-gray-700 text-lg">
Upload Doctor Picture
</p>
<p className="text-sm text-gray-400">
PNG or JPG recommended
</p>
</div>

</div>



<div className="grid grid-cols-1 md:grid-cols-2 gap-6">


{/* NAME */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-600">
Doctor Name
</label>

<input
value={name}
onChange={(e)=>setName(e.target.value)}
type="text"
placeholder="Enter doctor name"
className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
/>

</div>



{/* EMAIL */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-600">
Doctor Email
</label>

<input
value={email}
onChange={(e)=>setEmail(e.target.value)}
type="email"
placeholder="Enter email"
className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
/>

</div>


{/* phone */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-600">
Doctor Phone
</label>

<input
value={phone}
onChange={(e)=>setPhone(e.target.value)}
type="text"
placeholder="Enter doctor phone"
className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
/>

</div>












{/* PASSWORD */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-600">
Password
</label>

<input
value={password}
onChange={(e)=>setPassword(e.target.value)}
type="password"
placeholder="Strong password required"
className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
/>

</div>



{/* SPECIALITY */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-600">
Speciality
</label>

<select
value={speciality}
onChange={(e)=>setSpeciality(e.target.value)}
className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
>

<option>General physician</option>
<option>Gynecologist</option>
<option>Dermatologist</option>
<option>Pediatricians</option>
<option>Neurologist</option>
<option>Gastroenterologist</option>

</select>

</div>



{/* DEGREE */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-600">
Degree
</label>

<input
value={degree}
onChange={(e)=>setDegree(e.target.value)}
type="text"
placeholder="Enter degree"
className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
/>

</div>



{/* EXPERIENCE */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-600">
Experience
</label>

<select
value={experience}
onChange={(e)=>setExperience(e.target.value)}
className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
>

<option>1 Year</option>
<option>2 Years</option>
<option>3 Years</option>
<option>4 Years</option>
<option>5 Years</option>
<option>6 Years</option>
<option>8 Years</option>
<option>9 Years</option>
<option>10 Years</option>

</select>

</div>



{/* FEES */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-600">
Doctor Fees
</label>

<input
value={fees}
onChange={(e)=>setFees(e.target.value)}
type="number"
placeholder="Enter fees"
className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
/>

</div>



{/* ADDRESS */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-600">
Address
</label>

<input
value={address1}
onChange={(e)=>setAddress1(e.target.value)}
type="text"
placeholder="Address line 1"
className="w-full px-4 py-3 rounded-xl border bg-gray-50 mb-2 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
/>

<input
value={address2}
onChange={(e)=>setAddress2(e.target.value)}
type="text"
placeholder="Address line 2"
className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
/>

</div>

</div>



{/* ABOUT */}

<div className="space-y-2">

<label className="text-sm font-medium text-gray-600">
About Doctor
</label>

<textarea
rows="4"
value={about}
onChange={(e)=>setAbout(e.target.value)}
placeholder="Write about doctor..."
className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
/>

</div>



<button
type="submit"
className="w-full py-4 text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 transform hover:scale-105 transition duration-300 shadow-lg"
>

Add Doctor

</button>

</form>

</div>

)

}

export default AddDoctor