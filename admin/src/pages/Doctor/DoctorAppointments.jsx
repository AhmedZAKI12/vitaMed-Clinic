import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";

const DoctorAppointments = () => {

  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment,
    confirmAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const filteredAppointments = appointments.filter((item) =>
    item.userData.name.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // STATUS
  // =========================
  const renderStatus = (item) => {

    const base =
      "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md w-fit";

    if (item.status === "completed") {
      return (
        <span className={`${base} bg-green-100 text-green-700`}>
          Completed
        </span>
      );
    }

    if (item.status === "cancelled") {
      return (
        <span className={`${base} bg-red-100 text-red-700`}>
          Cancelled
        </span>
      );
    }

    if (item.status === "confirmed") {
      return (
        <span className={`${base} bg-blue-100 text-blue-700`}>
          Confirmed
        </span>
      );
    }

    return (
      <span className={`${base} bg-yellow-100 text-yellow-700`}>
        Pending
      </span>
    );
  };

  // =========================
  // ACTIONS
  // =========================
  const renderActions = (item) => {

    if (item.status === "completed" || item.status === "cancelled") {
      return <span className="text-gray-400 text-xs">Done</span>;
    }

    return (
      <div className="flex gap-3">

        {item.status === "pending" && (
          <button
            onClick={() => confirmAppointment(item._id)}
            className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
          >
            Confirm
          </button>
        )}

        {item.status === "confirmed" && (
          <button
            onClick={() => completeAppointment(item._id)}
            className="px-3 py-1 text-xs rounded bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
          >
            Complete
          </button>
        )}

        <button
          onClick={() => cancelAppointment(item._id)}
          className="px-3 py-1 text-xs rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
        >
          Cancel
        </button>

      </div>
    );
  };

  return (
    <div className="w-full p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">

        <h1 className="text-2xl font-bold text-slate-700">
          Doctor Appointments
        </h1>

        <input
          type="text"
          placeholder="Search patient..."
          className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Total */}
      <div className="bg-white shadow-sm rounded-lg p-4 mb-6 w-56">
        <p className="text-gray-500 text-sm">Total Appointments</p>
        <p className="text-2xl font-bold text-slate-700">
          {filteredAppointments.length}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr_2fr] px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-500 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">

          {filteredAppointments.map((item, index) => (

            <div
              key={item._id}
              className="grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr_2fr] items-center px-6 py-4 border-b text-sm hover:bg-blue-50 transition"
            >

              <p className="text-gray-400">{index + 1}</p>

              <div className="flex items-center gap-3">
                <img
                  src={item.userData.image}
                  className="w-9 h-9 rounded-full object-cover"
                  alt=""
                />
                <p className="font-medium">{item.userData.name}</p>
              </div>

              <p className="text-gray-500 text-xs">
                {item.payment ? "Online" : "Cash"}
              </p>

              <p>{calculateAge(item.userData.dob)}</p>

              <p className="text-gray-500">
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>

              <p className="font-medium">
                {currency}{item.amount}
              </p>

              {renderStatus(item)}

              {renderActions(item)}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default DoctorAppointments;