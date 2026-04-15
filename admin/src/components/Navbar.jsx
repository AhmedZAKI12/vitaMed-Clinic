import React, { useContext } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
<div className="flex justify-between items-center px-6 py-4
bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900
text-white shadow-lg">
      {/* LEFT SIDE */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center gap-3 cursor-pointer group"
      >

        {/* LOGO */}
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center 
        text-blue-600 font-bold text-lg shadow group-hover:scale-110 transition">

          VM

        </div>

        {/* PROJECT NAME */}
        <div className="flex flex-col leading-tight">

          <p className="text-white font-semibold text-lg tracking-wide">
            VitaMed Clinic
          </p>

          <p className="text-blue-200 text-xs">
            Admin panel
          </p>

        </div>

        {/* ROLE BADGE */}
        <span className="ml-4 text-xs px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur">

          {aToken ? 'Admin' : 'Doctor'}

        </span>

      </div>


      {/* RIGHT SIDE */}
      <button
        onClick={logout}
        className="bg-white text-blue-600 text-sm px-6 py-2 rounded-full font-medium
        hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow"
      >
        Logout
      </button>

    </div>

  )
}

export default Navbar