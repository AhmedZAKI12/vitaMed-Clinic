import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  if (!dashData) return null

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">

      {/* Title */}
      <h1 className="text-2xl font-bold text-slate-700 mb-8">
        Doctor Dashboard
      </h1>

      {/* ===== Stat Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Earnings */}
        <div className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Earnings</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">
              {currency} {dashData.earnings}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-indigo-100 group-hover:scale-110 transition">
            <img className="w-8" src={assets.earning_icon} alt="" />
          </div>
        </div>

        {/* Appointments */}
        <div className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Appointments</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {dashData.appointments}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-blue-100 group-hover:scale-110 transition">
            <img className="w-8" src={assets.appointments_icon} alt="" />
          </div>
        </div>

        {/* Patients */}
        <div className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Patients</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">
              {dashData.patients}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-emerald-100 group-hover:scale-110 transition">
            <img className="w-8" src={assets.patients_icon} alt="" />
          </div>
        </div>

      </div>


      {/* ===== Latest Bookings ===== */}
      <div className="bg-white mt-10 rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        {/* header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-slate-50">
          <img className="w-5 opacity-80" src={assets.list_icon} alt="" />
          <p className="font-semibold text-slate-700">
            Latest Bookings
          </p>
        </div>

        {/* list */}
        <div className="divide-y">

          {dashData.latestAppointments.slice(0, 5).map((item, index) => (

            <div
              key={index}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition"
            >

              <img
                className="w-11 h-11 rounded-full border"
                src={item.userData.image}
                alt=""
              />

              <div className="flex-1">

                <p className="font-medium text-slate-700">
                  {item.userData.name}
                </p>

                <p className="text-sm text-slate-500">
                  Booking on {slotDateFormat(item.slotDate)}
                </p>

              </div>


              {/* Status */}
              {item.cancelled ? (

                <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 font-medium">
                  Cancelled
                </span>

              ) : item.isCompleted ? (

                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                  Completed
                </span>

              ) : (

                <div className="flex gap-2">

                  <button
                    onClick={() => completeAppointment(item._id)}
                    className="px-3 py-1 text-xs rounded-md bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    Complete
                  </button>

                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default DoctorDashboard