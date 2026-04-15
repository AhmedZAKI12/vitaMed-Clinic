import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

import { Users, CalendarDays, Stethoscope } from "lucide-react";

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext)

  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  if (!dashData) {
    return <p className="m-6 text-gray-500">Loading Dashboard...</p>
  }

  return (
    <div className="p-8 w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-700 mb-10 tracking-tight">
        Admin Dashboard
      </h1>


      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Doctors */}
        <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 flex justify-between items-center border border-gray-100">

          <div>
            <p className="text-gray-500 text-sm">Doctors</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-1 group-hover:scale-105 transition">
              {dashData.doctors}
            </h2>
          </div>

          <div className="bg-blue-100 p-4 rounded-xl group-hover:rotate-6 transition">
            <Stethoscope className="text-blue-600" size={32} />
          </div>

        </div>


        {/* Appointments */}
        <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 flex justify-between items-center border border-gray-100">

          <div>
            <p className="text-gray-500 text-sm">Appointments</p>
            <h2 className="text-3xl font-bold text-green-600 mt-1 group-hover:scale-105 transition">
              {dashData.appointments}
            </h2>
          </div>

          <div className="bg-green-100 p-4 rounded-xl group-hover:rotate-6 transition">
            <CalendarDays className="text-green-600" size={32} />
          </div>

        </div>


        {/* Patients */}
        <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 flex justify-between items-center border border-gray-100">

          <div>
            <p className="text-gray-500 text-sm">Patients</p>
            <h2 className="text-3xl font-bold text-purple-600 mt-1 group-hover:scale-105 transition">
              {dashData.patients}
            </h2>
          </div>

          <div className="bg-purple-100 p-4 rounded-xl group-hover:rotate-6 transition">
            <Users className="text-purple-600" size={32} />
          </div>

        </div>

      </div>


      {/* ===== LATEST BOOKINGS ===== */}
      <div className="bg-white rounded-2xl shadow-md mt-12 overflow-hidden border border-gray-100">

        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700">
            Latest Bookings
          </h2>
        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left p-4">Doctor</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>

            <tbody>

              {dashData.latestAppointments.slice(0,5).map((item,index)=>(

                <tr
                  key={index}
                  className="border-t hover:bg-blue-50 transition duration-200"
                >

                  <td className="p-4 flex items-center gap-3">

                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={item.docData.image}
                      alt=""
                    />

                    <span className="font-medium text-gray-700">
                      {item.docData.name}
                    </span>

                  </td>


                  <td className="p-4 text-gray-500">
                    {slotDateFormat(item.slotDate)}
                  </td>


                  <td className="p-4">

                    {item.cancelled ? (

                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                        Cancelled
                      </span>

                    ) : item.isCompleted ? (

                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                        Completed
                      </span>

                    ) : (

                      <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">
                        Pending
                      </span>

                    )}

                  </td>


                  <td className="p-4">

                    {!item.cancelled && !item.isCompleted && (

                      <button
                        onClick={()=>cancelAppointment(item._id)}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Dashboard