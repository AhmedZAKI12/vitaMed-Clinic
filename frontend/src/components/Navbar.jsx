import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (

    <div className='w-full flex justify-center mt-4 mb-6'>

      <div className='w-full max-w-6xl flex items-center justify-between px-6 py-3 bg-white rounded-2xl shadow-md border'>

        {/* -------- Logo -------- */}
        <div
          onClick={() => navigate('/')}
          className='flex items-center cursor-pointer group'
        >
          <h1 className='text-2xl md:text-3xl font-extrabold tracking-tight'>
            <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
              VitaMed
            </span>
            <span className='ml-2 text-gray-700'>Clinic</span>
          </h1>
        </div>

        {/* -------- Links -------- */}
        <ul className='hidden md:flex items-center gap-8 font-medium'>

          {/* 🔥 ACTIVE LINK */}
          {[
            { path: '/', name: 'Home' },
            { path: '/doctors', name: 'Doctors' },
            { path: '/about', name: 'About' },
            { path: '/contact', name: 'Contact' },
          ].map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative transition ${
                  isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`
              }
            >
              {link.name}

              {/* 🔥 الخط تحت الصفحة */}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ${
                  window.location.pathname === link.path
                    ? 'w-full'
                    : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </NavLink>
          ))}

        </ul>

        {/* -------- Right -------- */}
        <div className='flex items-center gap-4'>

          {
            token && userData ? (

              <div className='relative'>

                {/* 👇 الصورة */}
                <img
                  onClick={() => setShowMenu(!showMenu)}
                  className='w-10 h-10 rounded-full object-cover border-2 border-gray-200 cursor-pointer hover:scale-105 transition'
                  src={userData.image}
                  alt=""
                />

                {/* 🔥 Dropdown بالـ click */}
                {showMenu && (
                  <div className='absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-xl py-2 z-50'>

                    <p
                      onClick={() => {
                        navigate('/my-profile')
                        setShowMenu(false)
                      }}
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm'
                    >
                      My Profile
                    </p>

                    <p
                      onClick={() => {
                        navigate('/my-appointments')
                        setShowMenu(false)
                      }}
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm'
                    >
                      My Appointments
                    </p>

                    <p
                      onClick={() => {
                        logout()
                        setShowMenu(false)
                      }}
                      className='px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer text-sm'
                    >
                      Logout
                    </p>

                  </div>
                )}

              </div>

            ) : (

              <button
                onClick={() => navigate('/login')}
                className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full shadow hover:scale-105 transition'
              >
                Get Started
              </button>

            )
          }

        </div>

      </div>

    </div>
  )
}

export default Navbar