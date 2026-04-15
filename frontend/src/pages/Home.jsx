import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import Footer from "../components/Footer"

const Home = () => {

  const [recommendedDoctor, setRecommendedDoctor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedSpeciality, setSelectedSpeciality] = useState("")
  const navigate = useNavigate()

  const getRecommendedDoctor = async () => {

    if (!selectedSpeciality) return

    try {
      setLoading(true)

      // 🔥 امسح القديم قبل ما تجيب الجديد
      setRecommendedDoctor(null)

      const res = await axios.get(
        `http://localhost:5000/api/doctor/recommend?speciality=${selectedSpeciality}`
      )

      if (res.data.success && res.data.doctor) {
        setRecommendedDoctor(res.data.doctor)
      } else {
        setRecommendedDoctor(null)
      }

    } catch (error) {
      console.log(error)
      setRecommendedDoctor(null)
    } finally {
      setLoading(false)
    }
  }

  // 🔥 AUTO RECOMMEND
  useEffect(() => {
    if (selectedSpeciality) {
      getRecommendedDoctor()
    }
  }, [selectedSpeciality])

  return (
    <div>
      <Header />

      {/* اختيار التخصص */}
      <SpecialityMenu setSelectedSpeciality={setSelectedSpeciality} />

      {/* Loading */}
      {loading && (
        <div className="text-center mt-6 text-gray-500">
          ⏳ Finding best doctor...
        </div>
      )}

      {/* عرض الدكتور */}
      {/* عرض الدكتور */}
{!loading && recommendedDoctor && (
  <div className="flex justify-center mt-12 px-4">

    <div className="group w-[340px] bg-white rounded-3xl shadow-md hover:shadow-2xl 
    transition-all duration-500 overflow-hidden hover:-translate-y-2">

      {/* 🔥 Image */}
      <div className="relative overflow-hidden">

        <img
          src={recommendedDoctor.image}
          alt=""
          className="w-full h-[240px] object-cover transition duration-500 group-hover:scale-110"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>

        {/* badge */}
        <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 
        text-white text-xs px-3 py-1 rounded-full shadow-md">
          ⭐ Recommended
        </span>

      </div>

      {/* 🔥 Content */}
      <div className="p-5 text-center">

        {/* name */}
        <h3 className="text-lg font-bold text-gray-800 tracking-wide 
        group-hover:text-blue-600 transition">
          {recommendedDoctor.name}
        </h3>

        {/* speciality */}
        <p className="text-gray-500 text-sm mt-1">
          {recommendedDoctor.speciality}
        </p>

        {/* ⭐ rating */}
        <div className="flex justify-center items-center gap-2 mt-3">
          <span className="text-yellow-400 text-lg">⭐</span>
          <span className="text-sm text-gray-600 font-medium">
            {recommendedDoctor.rating
              ? recommendedDoctor.rating.toFixed(1)
              : "No rating"}
          </span>
        </div>

        {/* 🔥 Button */}
        <button
          onClick={() => navigate(`/appointment/${recommendedDoctor._id}`)}
          className="mt-5 w-full py-2.5 rounded-full 
          bg-gradient-to-r from-blue-600 to-indigo-600 
          text-white font-medium text-sm
          hover:scale-105 hover:shadow-lg transition duration-300"
        >
          Book Appointment
        </button>

      </div>

    </div>

  </div>
)}

      {/* ❗ مفيش دكاترة */}
      {!loading && selectedSpeciality && !recommendedDoctor && (
        <p className="text-center mt-6 text-gray-400">
          No doctors available for this speciality 😢
        </p>
      )}

      <TopDoctors />
      <Banner />
      {/* <Footer/> */}
    </div>
  )
}

export default Home