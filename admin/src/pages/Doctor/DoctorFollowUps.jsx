import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DoctorFollowUps = () => {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getRecords = async () => {
    try {
      if (!dToken) {
        toast.error("Login first");
        return;
      }

      const { data } = await axios.get(
        backendUrl + "/api/doctor/follow-ups",
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );

      if (data.success) {
        setRecords(data.records);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dToken) getRecords();
  }, [dToken]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Follow-ups</h2>

      {records.length === 0 ? (
        <p>No follow-ups found</p>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
<div
  key={r._id}
  onClick={() => navigate(`/doctor-follow-up/${r._id}`)}
  className="p-4 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition"
>
  <p className="font-bold text-lg">
    {r.patientId?.name || "Unknown Patient"}
  </p>

{r.updates?.length > 0?(
  <p>Updates: {r.updates.length}</p>
  ): (
  <p className="text-gray-500 text-sm">No updates yet</p>)}

</div>


          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorFollowUps;