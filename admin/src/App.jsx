import { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Contexts
import { DoctorContext } from './context/DoctorContext'
import { AdminContext } from './context/AdminContext'

// Layout
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import DoctorChatbot from './components/DoctorChatbot'

// Admin Pages
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorsList from './pages/Admin/DoctorsList'
import  BookAppointment  from "./pages/Admin/BookAppointment"

// Doctor Pages
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorProfile from './pages/Doctor/DoctorProfile'
import DoctorFollowUps from './pages/Doctor/DoctorFollowUps'
import DoctorFollowUpDetails from './pages/Doctor/DoctorFollowUpDetails'

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  // ❌ لو مفيش login
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

      {dToken && <DoctorChatbot />}

      {/* Navbar */}
      <Navbar />

      <div className='flex'>

        {/* Sidebar حسب ال role */}
        {aToken && !dToken && <Sidebar type="admin" />}
        {dToken && !aToken && <Sidebar type="doctor" />}

        {/* Content */}
        <div className='flex-1 p-6'>

          <Routes>

            {/* 🔥 Redirect حسب نوع المستخدم */}
            <Route
              path="/"
              element={
                aToken
                  ? <Navigate to="/admin-dashboard" />
                  : <Navigate to="/doctor-dashboard" />
              }
            />

            {/* ================= ADMIN ================= */}
            {aToken && !dToken && (
              <>
                <Route path='/admin-dashboard' element={<Dashboard />} />
                <Route path='/all-appointments' element={<AllAppointments />} />
                <Route path='/add-doctor' element={<AddDoctor />} />
                <Route path='/doctor-list' element={<DoctorsList />} />
                <Route path='/book-appointment' element={<BookAppointment/>}/>
              </>
            )}

            {/* ================= DOCTOR ================= */}
            {dToken && !aToken && (
              <>
                <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                <Route path='/doctor-appointments' element={<DoctorAppointments />} />
                <Route path='/doctor-profile' element={<DoctorProfile />} />
                <Route path='/doctor-follow-ups' element={<DoctorFollowUps />} />
                <Route path='/doctor-follow-up/:id' element={<DoctorFollowUpDetails />} />
              </>
            )}

            {/* ❌ أي route غلط */}
            <Route
              path="*"
              element={
                aToken
                  ? <Navigate to="/admin-dashboard" />
                  : <Navigate to="/doctor-dashboard" />
              }
            />

          </Routes>

        </div>

      </div>

    </div>
  )
}

export default App