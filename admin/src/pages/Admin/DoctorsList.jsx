import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {

  const { doctors, setDoctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/delete-doctor/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setDoctors((prev) => prev.filter((doc) => doc._id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error deleting doctor");
    }
  };

  // =====================
  // SEARCH + FILTER
  // =====================

  const filteredDoctors = doctors.filter((doc) => {

    const matchSearch =
      doc.name.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" || doc.speciality === filter;

    return matchSearch && matchFilter;
  });

  // specialties list
  const specialities = [
    "All",
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">

      {/* TITLE */}
      <h1 className="text-2xl font-bold text-gray-700 mb-6">
        Doctors List
      </h1>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">

        {/* search */}
        <input
          type="text"
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        >
          {specialities.map((spec) => (
            <option key={spec}>{spec}</option>
          ))}
        </select>

      </div>

      {/* DOCTORS GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {filteredDoctors.map((doc) => (

          <div
            key={doc._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300 p-6 flex flex-col items-center text-center"
          >

            {/* IMAGE */}
            <div className="relative mb-4">

              <img
                src={doc.image}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
              />

              {/* availability indicator */}
              <span
                className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                  doc.available ? "bg-green-400" : "bg-gray-400"
                }`}
              ></span>

            </div>

            {/* NAME */}
            <h2 className="font-semibold text-lg text-gray-800">
              {doc.name}
            </h2>

            {/* SPECIALITY */}
            <p className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full mt-1">
              {doc.speciality}
            </p>

            {/* PHONE */}
            <p className="text-md text-gray-600 mt-2">
              {doc.phone}
            </p>


            {/* AVAILABILITY */}
            <label className="flex items-center gap-2 mt-4 cursor-pointer text-sm">

              <input
                type="checkbox"
                checked={doc.available}
                onChange={() => changeAvailability(doc._id)}
                className="accent-blue-500"
              />

              Available

            </label>

            {/* DELETE BUTTON */}

            <button
              onClick={() => handleDelete(doc._id)}
              className="mt-5 w-full py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 hover:scale-105 transition"
            >
              Delete Doctor
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;