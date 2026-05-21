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
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Follow-up Details</h2>

      {/* Updates */}
      <div>
        <h3 className="font-semibold mb-2">Patient Updates</h3>
        {record.updates?.map((u, i) => (
          <div key={i} className="border p-3 mb-2">
            <p>Pain: {u.painLevel}</p>
            <p>{u.symptoms}</p>
          </div>
        ))}
      </div>

      {/* Replies */}
      <div>
        <h3 className="font-semibold mb-2">Doctor Replies</h3>
        {record.doctorReplies?.map((r, i) => (
          <div key={i} className="bg-green-100 p-2 mb-2">
            {r.message}
          </div>
        ))}
      </div>

            {/* PRESCRIPTIONS */}
  <div>
    <h3 className="font-semibold mb-2">Prescriptions</h3>

    {(!record.prescriptions || record.prescriptions.length === 0) && (
      <p>No prescriptions yet</p>
    )}

    {record.prescriptions?.map((p, i) => (
      <div key={i} className="bg-blue-100 p-2 mb-2">
        <p className="text-xs text-gray-500">
          {new Date(p.createdAt).toLocaleString()}
        </p>
        <p>{p.text}</p>
      </div>
    ))}
  </div>





      {/* Add reply */}
      <div className="space-y-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2"
          placeholder="Write reply..."
        />
        <textarea
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          className="w-full border p-2"
          placeholder="Write prescription (optional)..."
        />

        <button
          onClick={sendReply}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send Reply
        </button>
      </div>





    </div>
  );
};

export default DoctorFollowUpDetails;