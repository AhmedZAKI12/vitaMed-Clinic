import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export const AppContext = createContext()

const AppContextProvider = (props) => {

  const currencySymbol = " EGP "

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [doctors, setDoctors] = useState([])

  // ✅ FIX 1: token handling
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  )

  const [userData, setUserData] = useState(null)

  // // ================= AXIOS DEFAULT =================
  // // 🔥 أهم حركة: تخلي كل الريكوستات تاخد التوكن لوحدها
  // useEffect(() => {
  //   if (token) {
  //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  //   } else {
  //     delete axios.defaults.headers.common["Authorization"]
  //   }
  // }, [token])

  // ================= GET DOCTORS =================
  const getDoctosData = async () => {

    try {

      const { data } = await axios.get(
        backendUrl + "/api/doctor/list"
      )

      if (data.success) {
        setDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error("Failed to load doctors")
    }

  }

  // ================= LOAD USER PROFILE =================
  const loadUserProfileData = async () => {

    try {

      const { data } = await axios.get(
        backendUrl + "/api/user/get-profile"
      )

      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)

      // 🔥 لو التوكن بايظ → اعمل logout تلقائي
      if (error.response?.status === 401) {
        logout()
        toast.error("Session expired. Please login again.")
        return
      } else {
        toast.error("Failed to load profile")
      }
    }

  }

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUserData(null)
  }

  // ================= INIT =================
  useEffect(() => {
    getDoctosData()
  }, [])

  useEffect(() => {
    if (token) {
      loadUserProfileData()
    }
  }, [token])

  const value = {
    doctors,
    getDoctosData,

    currencySymbol,
    backendUrl,

    token,
    setToken,

    userData,
    setUserData,

    loadUserProfileData,
    logout
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )

}

export default AppContextProvider