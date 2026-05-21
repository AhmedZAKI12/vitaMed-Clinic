import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { AppContext } from "../context/AppContext"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const MyFollowUps = () => {

  const { backendUrl, token } = useContext(AppContext)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const getFollowUps = async () => {
    try {

      const { data } = await axios.get(
        backendUrl + "/api/user/my-follow-ups",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (data.success) {
        setRecords(data.records)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error("Failed to load follow-ups")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) getFollowUps()
  }, [token])



  
  // 🎯 تحويل diagnosis
  const formatDiagnosis = (diagnosis, status) => {
  if (status === "pending") {
    return "Waiting for doctor update"
  }
  if (status === "active") {
    return diagnosis || "Doctor has responded"
  }
  if (status === "closed") {
    return "Follow-up closed"
  }
}

  // 🎯 status color
  const getStatus = (status) => {
  if (status === "pending") {
    return { text: "Pending", color: "bg-yellow-100 text-yellow-700" }
  }
  if (status === "active") {
    return { text: "Doctor Replied", color: "bg-green-100 text-green-700" }
  }
  if (status === "closed") {
    return { text: "Closed", color: "bg-gray-200 text-gray-700" }
  }
}
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            🩺 My Follow-Ups
          </h2>
        </div>

        {/* LOADING */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : records.length === 0 ? (

          <div className="text-center mt-20">
            <p className="text-gray-500 text-lg">
              No follow-ups yet 😴
            </p>
          </div>


        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {records.map((rec) => {

              const status = getStatus(rec.status)

              return (
                <div
                  key={rec.recordId || rec._id}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition border border-gray-100 flex flex-col justify-between"
                >

                  {/* TOP */}
                  <div>

                    {/* STATUS */}
                    <span className={`text-xs px-3 py-1 rounded-full ${status.color}`}>
                      {status.text}
                    </span>

                    {/* DIAGNOSIS */}
                    <h3 className="mt-3 text-lg font-semibold text-gray-800">
                      {formatDiagnosis(rec.diagnosis, rec.status)}
                    </h3>


                    {/* DOCTOR */}
                    <p className="text-gray-600 mt-2 text-sm">
                      {rec.doctor?.name || "Unknown"}
                    </p>

                    {/* DATE */}
                    <p className="text-xs text-gray-400 mt-1">
                      📅 {
                        new Date(
                          rec.followUpDate || rec.createdAt || Date.now()
                        ).toLocaleString()
                      }
                    </p>

                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => navigate(`/follow-up-details/${rec.recordId}`)}
                    className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition font-medium"
                  >
                    View Details →
                  </button>

                </div>
              )
            })}

          </div>

        )}

      </div>

    </div>
  )
}

export default MyFollowUps