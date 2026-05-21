import { useParams, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const FollowUp = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const { backendUrl, token } = useContext(AppContext)

  const [painLevel, setPainLevel] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  // =========================
  // SUBMIT FOLLOW UP
  // =========================
  const submitFollowUp = async () => {

    if (!painLevel || !symptoms) {
      return toast.error("Please fill all required fields")
    }

    if (painLevel < 1 || painLevel > 10) {
      return toast.error("Pain level must be between 1 and 10")
    }

    try {

      setLoading(true)

      const { data } = await axios.post(
        backendUrl + '/api/user/add-follow-up-update',
        {
          recordId: id,
          painLevel,
          symptoms,
          notes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (data.success) {

        toast.success("Follow-up submitted successfully ✅")

        // Reset form
        setPainLevel('')
        setSymptoms('')
        setNotes('')

        // Navigate back
        setTimeout(() => {
          navigate('/my-appointments')
        }, 1200)

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error("Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">

      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg border">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Follow-Up Update
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Help your doctor track your recovery
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* PAIN LEVEL */}
          <div>
            <label className="text-sm text-gray-600">
              Pain Level (1-10)
            </label>

            <input
              type="number"
              value={painLevel}
              onChange={(e) => setPainLevel(e.target.value)}
              placeholder="Enter pain level"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          {/* SYMPTOMS */}
          <div>
            <label className="text-sm text-gray-600">
              Symptoms
            </label>

            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          {/* NOTES */}
          <div>
            <label className="text-sm text-gray-600">
              Additional Notes
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any extra details..."
              rows={3}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={submitFollowUp}
          disabled={loading}
          className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Follow-Up"}
        </button>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/my-appointments')}
          className="w-full mt-3 text-gray-500 text-sm hover:underline"
        >
          ← Back to Appointments
        </button>

      </div>

    </div>
  )
}

export default FollowUp