import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

const DoctorFollowUpDetails = () => {
  const { id } = useParams();
  const { backendUrl, dToken } = useContext(DoctorContext);

  const [record, setRecord] = useState(null);
  const [message, setMessage] = useState("");
  const [prescription, setPrescription] = useState("");
  const [loading, setLoading] = useState(true);

  const getRecord = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + `/api/doctor/follow-up/${id}`,
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );

      if (data.success) {
        setRecord(data.record);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error loading record");
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async () => {
    if (!message) return toast.error("Write something");

    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/reply-follow-up",
        {
          recordId: id,
          message,
          prescription
        },
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );

      if (data.success) {
        toast.success("Reply sent");
        setMessage("");
        setPrescription("");

        setRecord((prev) => ({
          ...prev,
          doctorReplies: [
            { message, createdAt: new Date() },
            ...(prev.doctorReplies || []),
          ],
        }));
      }
    } catch (err) {
      toast.error("Error");
    }
  };

  useEffect(() => {
    if (dToken) getRecord();
  }, [dToken]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!record) return <p>No data</p>;

  return (
  <div className="p-6 max-w-7xl mx-auto space-y-6">

    {/* HEADER */}
    <div className="bg-white rounded-2xl shadow-md border p-6">
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Follow-Up Details
          </h1>

          <p className="text-gray-500 mt-1">
            Review patient progress and provide medical guidance
          </p>
        </div>

        <div
          className={`px-4 py-2 rounded-full font-semibold ${
            record.status === "pending"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {record.status || "active"}
        </div>
      </div>
    </div>

    {/* STATS */}
    <div className="grid md:grid-cols-3 gap-4">

      <div className="bg-blue-50 rounded-2xl p-5 shadow">
        <p className="text-gray-500">Patient Updates</p>
        <h2 className="text-4xl font-bold text-blue-600">
          {record.updates?.length || 0}
        </h2>
      </div>

      <div className="bg-green-50 rounded-2xl p-5 shadow">
        <p className="text-gray-500">Doctor Replies</p>
        <h2 className="text-4xl font-bold text-green-600">
          {record.doctorReplies?.length || 0}
        </h2>
      </div>

      <div className="bg-purple-50 rounded-2xl p-5 shadow">
        <p className="text-gray-500">Prescriptions</p>
        <h2 className="text-4xl font-bold text-purple-600">
          {record.prescriptions?.length || 0}
        </h2>
      </div>

    </div>

    {/* UPDATES */}
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Patient Updates
      </h3>

      {record.updates?.length === 0 ? (
        <p className="text-gray-500">No updates yet</p>
      ) : (
        record.updates?.map((u, i) => (
          <div
            key={i}
            className="border-l-4 border-red-500 bg-red-50 rounded-xl p-4 mb-4"
          >
            <div className="flex justify-between">
              <h4 className="font-semibold text-red-700">
                Pain Level: {u.painLevel}/10
              </h4>
            </div>

            <p className="mt-2 text-gray-800">
              {u.symptoms}
            </p>

            {u.notes && (
              <p className="mt-2 text-gray-500">
                {u.notes}
              </p>
            )}
          </div>
        ))
      )}

    </div>

    {/* REPLIES */}
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h3 className="text-xl font-bold mb-4">
        Doctor Replies
      </h3>

      {record.doctorReplies?.length === 0 ? (
        <p className="text-gray-500">No replies yet</p>
      ) : (
        record.doctorReplies?.map((r, i) => (
          <div
            key={i}
            className="flex justify-end mb-3"
          >
            <div className="bg-green-500 text-white p-4 rounded-2xl max-w-xl shadow">
              {r.message}
            </div>
          </div>
        ))
      )}

    </div>

    {/* PRESCRIPTIONS */}
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h3 className="text-xl font-bold mb-4">
        Prescriptions
      </h3>

      {(!record.prescriptions ||
        record.prescriptions.length === 0) && (
        <p className="text-gray-500">
          No prescriptions yet
        </p>
      )}

      {record.prescriptions?.map((p, i) => (
        <div
          key={i}
          className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4 mb-3"
        >
          <p className="text-xs text-gray-500">
            {new Date(p.createdAt).toLocaleString()}
          </p>

          <p className="mt-1 font-medium">
            {p.text}
          </p>
        </div>
      ))}

    </div>

    {/* SEND REPLY */}
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">

      <h3 className="text-xl font-bold">
        Send Medical Response
      </h3>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your medical advice..."
      />

      <textarea
        value={prescription}
        onChange={(e) => setPrescription(e.target.value)}
        rows={4}
        className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Write prescription (optional)..."
      />

      <button
        onClick={sendReply}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold hover:scale-[1.01] transition-all"
      >
        Send Reply & Prescription
      </button>

    </div>

  </div>
);}

export default DoctorFollowUpDetails;