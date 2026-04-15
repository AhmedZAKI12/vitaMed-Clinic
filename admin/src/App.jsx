import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { DoctorContext } from './context/DoctorContext'
import { AdminContext } from './context/AdminContext'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'

// Admin Pages
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorsList from './pages/Admin/DoctorsList'

// Doctor Pages
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorProfile from './pages/Doctor/DoctorProfile'

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  // لو مش عامل login
  if (!dToken && !aToken) {
    return (
      <>
        <ToastContainer />
        <Login />
      </>
    )
  }

  return (
    <div className='bg-slate-300 min-h-screen'>
      
      <ToastContainer />

      {/* Navbar */}
      <Navbar />

      {/* Layout */}
      <div className='flex'>

        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <div className='flex-1 p-6'>

          <Routes>

            {/* Admin Routes */}
            {aToken && (
              <>
                <Route path='/' element={<Dashboard />} />
                <Route path='/admin-dashboard' element={<Dashboard />} />
                <Route path='/all-appointments' element={<AllAppointments />} />
                <Route path='/add-doctor' element={<AddDoctor />} />
                <Route path='/doctor-list' element={<DoctorsList />} />
              </>
            )}

            {/* Doctor Routes */}
            {dToken && (
              <>
                <Route path='/' element={<DoctorDashboard />} />
                <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                <Route path='/doctor-appointments' element={<DoctorAppointments />} />
                <Route path='/doctor-profile' element={<DoctorProfile />} />
              </>
            )}

          </Routes>

        </div>

      </div>

    </div>
  )
}

export default App