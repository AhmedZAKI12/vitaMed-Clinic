import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import jsPDF from 'jspdf'

const FollowUpDetails = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const { backendUrl, token } = useContext(AppContext)

  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)

  const [painLevel, setPainLevel] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // =========================
  // GET RECORD
  // =========================
  const getRecord = async () => {

    try {

      if (!token) {
        toast.error("Login first")
        return navigate('/login')
      }


      

      const { data } = await axios.get(
        backendUrl + `/api/user/my-follow-ups/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (data.success) {
        setRecord(data.record)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error("Failed to load follow-up")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
if (token) {
  getRecord()
}
  }, [token])

  // =========================
  // ADD UPDATE
  // =========================
  const addUpdate = async () => {

    console.log("TOKEN:", token) // 🔥 debug

    if (!painLevel || !symptoms) {
      return toast.error("Fill required fields")
    }

    if (Number(painLevel) < 1 || Number(painLevel) > 10) {
      return toast.error("Pain must be 1-10")
    }

    try {

      setSubmitting(true)

      const { data } = await axios.post(
        backendUrl + '/api/user/add-follow-up-update',
        {
          recordId: id,
          painLevel: Number(painLevel),
          symptoms,
          notes
        },
        {
          headers: {Authorization: `Bearer ${token}`}
        }
      )
if (data.success) {

  toast.success("Follow-up submitted successfully 💚")

  setPainLevel('')
  setSymptoms('')
  setNotes('')

  // ✅ تحديث الواجهة بدون ريفريش كامل
setRecord(prev => ({
  ...prev,
  updates: [
    {
      painLevel: Number(painLevel),
      symptoms,
      notes,
      createdAt: new Date()
    },
    ...(prev.updates || [])
  ]
}))

  
  // ✅ scroll لفوق عشان يشوف التايملاين
  window.scrollTo({ top: 0, behavior: "smooth" })

}else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  // =========================
  // UI
  // =========================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading...</p>
      </div>
    )
  }


  if (!record) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-500">No data found</p>
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10">

      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Follow-Up Details
          </h2>

          <button
            onClick={() => navigate('/my-appointments')}
            className="text-sm text-gray-500 hover:underline"
          >
            ← Back
          </button>
        </div>

        {/* TIMELINE */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold mb-4 text-gray-700">
            Updates Timeline
          </h3>

          {(!record.updates||record.updates.length === 0) && (
            <p className="text-gray-400 text-sm">
              No updates yet
            </p>
          )}

          <div className="space-y-4">




            {record.updates?.map((u, i) => (

              <div key={i} className="border-l-4 border-blue-500 pl-4">

                <p className="text-xs text-gray-400">
                  {new Date(u.createdAt).toLocaleString()}
                </p>

                <p className="text-gray-800 font-medium">
                  Pain: {u.painLevel}/10
                </p>

                <p className="text-gray-600">
                  {u.symptoms}
                </p>

                {u.notes && (
                  <p className="text-gray-400 text-sm italic">
                    {u.notes}
                  </p>
                )}

              </div>

            ))}

          </div>

        </div>

        {/* DOCTOR REPLIES */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold mb-4 text-gray-700">
            Doctor Replies
          </h3>

          {(!record.doctorReplies || record.doctorReplies.length === 0) && (
            <p className="text-gray-400 text-sm">
              No replies yet
            </p>
          )}

          <div className="space-y-3">



            {record.doctorReplies?.map((r, i) => (

              <div key={i} className="bg-green-50 p-3 rounded-lg">

                <p className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleString()}
                </p>

                <p className="text-gray-800">
                  {r.message}
                </p>

              </div>

            ))}

          </div>

        </div>


{/* PRESCRIPTIONS */}
<div className="bg-white p-6 rounded-xl shadow">

  <h3 className="font-semibold mb-4 text-gray-700">
    Prescriptions
  </h3>

  {(!record.prescriptions || record.prescriptions.length === 0) && (
    <p className="text-gray-400 text-sm">
      No prescriptions yet
    </p>
  )}

  <div className="space-y-3">

    {record.prescriptions?.map((p, i) => (

      <div key={i} className="bg-blue-50 p-3 rounded-lg">

        <p className="text-xs text-gray-400">
          {new Date(p.createdAt).toLocaleString()}
        </p>

        <div className="flex justify-between items-start gap-3">

  <div>
    <p className="text-xs text-gray-400">
      {new Date(p.createdAt).toLocaleString()}
    </p>

    <p className="text-gray-800 whitespace-pre-line">
      {p.text}
    </p>
  </div>

  <button
    onClick={() => downloadPDF(p, record)}
    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
  >
    PDF
  </button>

</div>
      </div>

    ))}

  </div>

</div>



        {/* ADD UPDATE */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold mb-4 text-gray-700">
            Add New Update
          </h3>

          <div className="space-y-3">

            <input
              type="number"
              placeholder="Pain level (1-10)"
              value={painLevel}
              onChange={(e) => setPainLevel(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              placeholder="Symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />

            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={addUpdate}
              disabled={submitting}
              className={`w-full py-2 rounded-lg transition ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              {submitting ? "Adding..." : "Add Update"}
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}


const downloadPDF = (prescription, record) => {

  const doc = new jsPDF()

  // ===== COLORS =====
  const primary = [0, 102, 204] // أزرق
  const gray = [120, 120, 120]

  // ===== HEADER =====
  doc.setFillColor(...primary)
  doc.rect(0, 0, 210, 30, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.text("VitaMed Clinic", 105, 15, { align: "center" })

  doc.setFontSize(10)
  doc.text("Professional Healthcare Services", 105, 22, { align: "center" })

  // ===== TITLE =====
  doc.setTextColor(...primary)
  doc.setFontSize(16)
  doc.text("Medical Prescription", 105, 45, { align: "center" })

  // ===== PATIENT INFO BOX =====
  doc.setDrawColor(200)
  doc.setFillColor(245, 247, 250)
  doc.roundedRect(15, 55, 180, 40, 3, 3, "FD")

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)

  // اسم المريض
  doc.text(
    `Patient: ${record?.patientId?.name || "N/A"}`,
    20,
    65
  )

  // اسم الدكتور (من غير Dr مكررة)
  const doctorName = record?.doctorId?.name?.startsWith("Dr")
    ? record?.doctorId?.name
    : `Dr. ${record?.doctorId?.name || ""}`

  doc.text(`Doctor: ${doctorName}`, 20, 75)

  // التاريخ
  doc.text(
    `Date: ${new Date(prescription.createdAt).toLocaleDateString()}`,
    20,
    85
  )

  // ID (حاجة احترافية)
  doc.text(
    `Prescription ID: ${record?._id?.slice(-6) || "---"}`,
    120,
    65
  )

  // ===== RX SECTION =====
  doc.setTextColor(...primary)
  doc.setFontSize(14)
  doc.text("℞ Treatment", 20, 110)

  // خط تحت العنوان
  doc.setDrawColor(...primary)
  doc.line(20, 113, 80, 113)

  // ===== PRESCRIPTION TEXT =====
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)

  const lines = doc.splitTextToSize(
    prescription.text || "No prescription provided",
    170
  )

  doc.text(lines, 20, 125)

  // ===== FOOTER =====
  doc.setDrawColor(200)
  doc.line(20, 260, 190, 260)

  doc.setFontSize(10)
  doc.setTextColor(...gray)

  doc.text(
    "Doctor Signature:",
    20,
    270
  )

  doc.text(
    "__________________________",
    70,
    270
  )

  doc.text(
    "This prescription is electronically generated.",
    105,
    280,
    { align: "center" }
  )

  // ===== SAVE =====
  doc.save(`Prescription_${record?._id?.slice(-4)}.pdf`)
}







export default FollowUpDetails