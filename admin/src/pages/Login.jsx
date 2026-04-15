import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (state === 'Admin') {

      const { data } = await axios.post(
        backendUrl + '/api/admin/login',
        { email, password }
      )

      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
        navigate('/admin-dashboard')
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(
        backendUrl + '/api/doctor/login',
        { email, password }
      )

      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
        navigate('/doctor-dashboard')
      } else {
        toast.error(data.message)
      }
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] relative overflow-hidden">

      {/* background glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full bottom-[-200px] right-[-200px]" />

      <form
        onSubmit={onSubmitHandler}
        className="relative z-10 flex flex-col gap-4 p-10 w-[380px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl text-white transition-all duration-300 hover:scale-[1.02]"
      >

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-2">

          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold shadow-lg">
            VM
          </div>

          <h1 className="text-xl font-semibold tracking-wide">
            VitaMed Clinic
          </h1>

          <p className="text-xs text-gray-300">
            Smart Healthcare System
          </p>

        </div>


        {/* Title */}
        <p className='text-2xl font-bold text-center mb-2'>
          <span className='text-blue-400'>{state}</span> Login
        </p>


        {/* Email */}
        <div>
          <p className='text-sm text-gray-300'>Email</p>

          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='w-full mt-1 p-2 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition'
            type="email"
            required
          />

        </div>


        {/* Password */}
        <div>
          <p className='text-sm text-gray-300'>Password</p>

          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='w-full mt-1 p-2 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition'
            type="password"
            required
          />

        </div>


        {/* Button */}
        <button
          className='mt-3 w-full py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 hover:shadow-2xl transition-all duration-300'
        >
          Login
        </button>


        {/* Switch Login */}
        {
          state === 'Admin'
            ? <p className='text-sm text-gray-300 text-center'>
                Doctor Login?{' '}
                <span
                  onClick={() => setState('Doctor')}
                  className='text-blue-400 cursor-pointer hover:text-blue-300 underline'
                >
                  Click here
                </span>
              </p>
            : <p className='text-sm text-gray-300 text-center'>
                Admin Login?{' '}
                <span
                  onClick={() => setState('Admin')}
                  className='text-blue-400 cursor-pointer hover:text-blue-300 underline'
                >
                  Click here
                </span>
              </p>
        }

      </form>

    </div>

  )
}

export default Login