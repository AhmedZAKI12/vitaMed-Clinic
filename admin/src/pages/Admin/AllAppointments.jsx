import { useEffect, useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { Search } from "lucide-react"

const AllAppointments = () => {

  const {
    aToken,
    appointments,
    cancelAppointment,
    completeAppointment,
    getAllAppointments
  } = useContext(AdminContext)

  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  const [search,setSearch] = useState("")

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  if (!appointments || appointments.length === 0) {
    return <p className="m-5">No appointments found</p>
  }

  const getStatus = (item) => {
    if (item.cancelled) {
      return (
        <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600 font-medium shadow-sm">
          Cancelled
        </span>
      )
    }
    if (item.isCompleted) {
      return (
        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600 font-medium shadow-sm">
          Completed
        </span>
      )
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600 font-medium shadow-sm">
        Pending
      </span>
    )
  }

  const filteredAppointments = appointments.filter((item)=>
    item.userData.name.toLowerCase().includes(search.toLowerCase()) ||
    item.docData.name.toLowerCase().includes(search.toLowerCase())
  )

  const total = appointments.length
  const completed = appointments.filter(a=>a.isCompleted).length
  const pending = appointments.filter(a=>!a.isCompleted && !a.cancelled).length

  return (

    <div className='w-full p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen'>

      <h1 className='text-3xl font-bold text-gray-700 mb-8'>
        All Appointments
      </h1>


      {/* ===== CARDS ===== */}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>

        <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow hover:scale-105 transition duration-300'>
          <p className='text-sm opacity-80'>Total Appointments</p>
          <h2 className='text-3xl font-bold mt-1'>{total}</h2>
        </div>

        <div className='bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-5 rounded-xl shadow hover:scale-105 transition duration-300'>
          <p className='text-sm opacity-80'>Pending</p>
          <h2 className='text-3xl font-bold mt-1'>{pending}</h2>
        </div>

        <div className='bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl shadow hover:scale-105 transition duration-300'>
          <p className='text-sm opacity-80'>Completed</p>
          <h2 className='text-3xl font-bold mt-1'>{completed}</h2>
        </div>

      </div>


      {/* ===== SEARCH ===== */}

      <div className='mb-6 relative w-full md:w-80'>

        <Search className='absolute left-3 top-3 text-gray-400' size={18}/>

        <input
          type="text"
          placeholder='Search patient or doctor...'
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition'
        />

      </div>


      {/* ===== TABLE ===== */}

      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>

        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1.5fr] py-4 px-6 bg-gray-100 text-gray-600 text-xs uppercase tracking-wider font-semibold'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
          <p>Action</p>
        </div>


        {filteredAppointments.map((item, index) => (
          <div
            key={index}
            className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1.5fr] items-center py-4 px-6 border-b hover:bg-blue-50 hover:shadow-sm transition duration-200'
          >

            <p className='max-sm:hidden font-medium text-gray-500'>
              {index + 1}
            </p>


            <div className='flex items-center gap-3'>
              <img
                src={item.userData.image}
                className='w-9 h-9 rounded-full object-cover ring-2 ring-blue-100'
                alt=""
              />
              <p className='font-medium text-gray-700'>
                {item.userData.name}
              </p>
            </div>


            <p className='max-sm:hidden'>
              {calculateAge(item.userData.dob)}
            </p>


            <p className='text-gray-600'>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>


            <div className='flex items-center gap-3'>
              <img
                src={item.docData.image}
                className='w-9 h-9 rounded-full bg-gray-200 ring-2 ring-gray-100'
                alt=""
              />
              <p className='text-gray-700'>
                {item.docData.name}
              </p>
            </div>


            <p className='font-semibold text-gray-700'>
              {currency}{item.amount}
            </p>


            {getStatus(item)}


            {!item.cancelled && !item.isCompleted ? (

              <div className="flex gap-2">

                <button
                  onClick={() => completeAppointment(item._id)}
                  className="px-3 py-1 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition shadow-sm"
                >
                  Complete
                </button>

                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition shadow-sm"
                >
                  Cancel
                </button>

              </div>

            ) : (
              <span className="text-gray-400 text-xs">—</span>
            )}

          </div>
        ))}

      </div>

    </div>

  )
}

export default AllAppointments