import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {

    const { docId } = useParams()

    const { currencySymbol, backendUrl, token, userData } = useContext(AppContext)

    const [docInfo,setDocInfo] = useState(false)
    const [timeSlots,setTimeSlots] = useState([])
    const [slotTime,setSlotTime] = useState('')
    const [selectedDate,setSelectedDate] = useState('')
    const [reviews,setReviews] = useState([])
    const [loadingReviews,setLoadingReviews] = useState(true)

    const navigate = useNavigate()

    // =========================
    // GET DOCTOR INFO (مهم للتحديث)
    // =========================
    const fetchDocInfo = async () =>{
        try{

            const { data } = await axios.get(
                backendUrl + "/api/doctor/list"
            )

            if(data.success){

                const doc = data.doctors.find(
                    doc => doc._id === docId
                )

                setDocInfo(doc)

            }

        }catch(error){
            console.log(error)
        }
    }

    // =========================
    // GET REVIEWS
    // =========================
    const fetchReviews = async () =>{
        try{

            setLoadingReviews(true)

            const { data } = await axios.get(
                backendUrl + `/api/doctor/reviews/${docId}`
            )

            if(data.success){
                setReviews(data.reviews)
            }

        }catch(error){
            console.log(error)
        }
        finally{
            setLoadingReviews(false)
        }
    }

    // =========================
    // GENERATE TIME SLOTS
    // =========================
    const generateTimeSlots = () => {

        if(!selectedDate || !docInfo) return

        let slots = []

        let start = new Date(selectedDate)
        start.setHours(10,0,0,0)

        let end = new Date(selectedDate)
        end.setHours(21,0,0,0)

        while(start < end){

            let formattedTime = start.toLocaleTimeString([],{
                hour:'2-digit',
                minute:'2-digit'
            })

            let day = start.getDate()
            let month = start.getMonth()+1
            let year = start.getFullYear()

            const slotDate = day + "_" + month + "_" + year

            const isBooked =
                docInfo.slots_booked?.[slotDate]?.includes(formattedTime)

            if(!isBooked){
                slots.push(formattedTime)
            }

            start.setMinutes(start.getMinutes()+30)
        }

        setTimeSlots(slots)
    }

    // =========================
    // BOOK APPOINTMENT
    // =========================
    const bookAppointment = async () =>{

        if(!token){
            toast.warning('Login first')
            return navigate('/login')
        }

        if(!selectedDate){
            return toast.error("Choose date first ⛔")
        }

        if(!slotTime){
            return toast.error("Choose time first ⛔")
        }

        let date = new Date(selectedDate)

        let day = date.getDate()
        let month = date.getMonth()+1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try{

            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment',
                {
                    userId:userData._id,
                    docId,
                    slotDate,
                    slotTime
                },
                { headers:{ token } }
            )

            if(data.success){

                toast.success("Booked Successfully ✅")

                // تحديث بيانات الدكتور
                await fetchDocInfo()

                navigate('/my-appointments')

            }
            else{
                toast.error(data.message)
            }

        }catch(error){
            console.log(error)
            toast.error(error.message)
        }
    }

    // =========================
    // EFFECTS
    // =========================
    useEffect(()=>{
        fetchDocInfo()
        fetchReviews()
    },[docId])

    useEffect(()=>{
        generateTimeSlots()
    },[selectedDate,docInfo])

    const avgRating = reviews.length
    ? (reviews.reduce((acc,r)=>acc+r.rating,0) / reviews.length).toFixed(1)
    : 0

    return docInfo ? (

        <div>

            {/* Doctor */}

            <div className='flex flex-col sm:flex-row gap-4'>

                <img
                className='bg-primary w-full sm:max-w-72 rounded-lg'
                src={docInfo.image}
                />

                <div className='flex-1 border rounded-lg p-8 bg-white'>

                    <p className='flex items-center gap-2 text-3xl font-medium'>
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon}/>
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-yellow-500 font-semibold text-lg">
                            ⭐ {avgRating}
                        </span>
                        <span className="text-gray-500 text-sm">
                            ({reviews.length} reviews)
                        </span>
                    </div>

                    <p className='mt-2 text-gray-600'>
                        {docInfo.degree} - {docInfo.speciality}
                    </p>

                    <p className='mt-2 text-gray-600'>
                        Experience: {docInfo.experience}
                    </p>

                    <p className='mt-3 text-gray-600'>
                        {docInfo.about}
                    </p>

                    <p className='mt-4 font-medium'>
                        Fees: {currencySymbol}{docInfo.fees}
                    </p>

                </div>

            </div>

            {/* Choose Date */}

            <div className='mt-8'>

                <p className='font-medium'>Choose Date</p>

                <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e)=>setSelectedDate(e.target.value)}
                className='border p-2 rounded mt-2'
                />

            </div>

            {/* Time Slots */}

            <div className='mt-8'>

                <p>Select Time</p>

                <div className='flex gap-2 mt-4 flex-wrap'>

                    {timeSlots.map((time,index)=>(
                        <span
                        key={index}
                        onClick={()=>setSlotTime(time)}
                        className={`px-4 py-2 rounded-full cursor-pointer
                        ${slotTime===time
                        ? 'bg-primary text-white'
                        : 'border'}`}
                        >
                            {time}
                        </span>
                    ))}

                </div>

                <button
                onClick={bookAppointment}
                className='bg-primary text-white px-10 py-3 rounded-full mt-6'
                >
                    Book
                </button>

            </div>

            {/* Reviews */}

            <div className="mt-10">

                <h2 className="text-xl font-semibold mb-4">
                    Patient Reviews
                </h2>

                {loadingReviews ? (

                    <p className="text-gray-500">
                        Loading reviews...
                    </p>

                ) : reviews.length === 0 ? (

                    <p className="text-gray-400">
                        No reviews yet
                    </p>

                ) : (

                    <div className="space-y-4">

                        {reviews.map((item,index)=>(

                            <div
                            key={index}
                            className="border rounded-lg p-4 bg-gray-50"
                            >

                                <div className="flex items-center gap-2 mb-1">

                                    <span className="text-yellow-500">
                                        {"⭐".repeat(item.rating)}
                                    </span>

                                    <span className="text-sm text-gray-600">
                                        {item.userName}
                                    </span>

                                </div>

                                <p className="text-gray-700 text-sm">
                                    {item.review}
                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            <RelatedDoctors
            speciality={docInfo.speciality}
            docId={docId}
            />

        </div>

    ) : null
}

export default Appointment