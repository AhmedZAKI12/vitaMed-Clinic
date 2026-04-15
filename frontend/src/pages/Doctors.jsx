import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const Doctors = () => {

  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);

  const [filterDoc, setFilterDoc] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // فلترة + سيرش
  useEffect(() => {
    let filtered = doctors;

    // فلترة بالتخصص
    if (speciality) {
      filtered = filtered.filter(doc => doc.speciality === speciality);
    }

    // فلترة بالبحث
    if (search.trim() !== "") {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilterDoc(filtered);
  }, [doctors, speciality, search]);

  return (
    <div className="px-6 md:px-12 lg:px-20 py-10">

      {/* Title + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Find Your Doctor
          </h1>
          <p className="text-gray-500 mt-1">
            Browse trusted doctors and book instantly
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-72 
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-2xl shadow-lg p-5 sticky top-24">

            <h2 className="font-semibold text-lg mb-4 text-gray-700">
              Specialities
            </h2>

            {/* All */}
            <button
              onClick={() => navigate("/doctors")}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm mb-2 transition
              ${
                !speciality
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-blue-50 text-gray-600"
              }`}
            >
              All
            </button>

            {[
              "General physician",
              "Gynecologist",
              "Dermatologist",
              "Pediatricians",
              "Neurologist",
              "Gastroenterologist"
            ].map((item, i) => (
              <button
                key={i}
                onClick={() =>
                  speciality === item
                    ? navigate("/doctors")
                    : navigate(`/doctors/${item}`)
                }
                className={`w-full text-left px-4 py-2 rounded-lg text-sm mb-2 transition
                ${
                  speciality === item
                    ? "bg-blue-600 text-white shadow"
                    : "hover:bg-blue-50 text-gray-600"
                }`}
              >
                {item}
              </button>
            ))}

          </div>
        </div>

        {/* Doctors Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {filterDoc.length > 0 ? (
            filterDoc.map((doc, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/appointment/${doc._id}`);
                  scrollTo(0, 0);
                }}
                className="bg-white rounded-2xl shadow-md overflow-hidden 
                hover:shadow-2xl hover:-translate-y-2 transition duration-300 cursor-pointer"
              >

                {/* Image */}
                <div className="relative">
                  <img
                    src={doc.image}
                    alt=""
                    className="w-full h-56 object-cover"
                  />

                  {/* Status */}
                  <span
                    className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full text-white
                    ${doc.available ? "bg-green-500" : "bg-gray-400"}`}
                  >
                    {doc.available ? "Available" : "Offline"}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">

                  <h3 className="text-lg font-semibold text-gray-800">
                    {doc.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {doc.speciality}
                  </p>

                  <button
                    className="mt-4 w-full py-2 rounded-lg 
                    bg-gradient-to-r from-blue-600 to-indigo-500 
                    text-white text-sm font-medium 
                    hover:scale-105 transition"
                  >
                    Book Appointment
                  </button>

                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No doctors found</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Doctors;