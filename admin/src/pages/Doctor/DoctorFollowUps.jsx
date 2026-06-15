import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DoctorFollowUps = () => {
  const { backendUrl, dToken } = useContext(DoctorContext);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
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
    if (dToken) {
      getRecords();
    }
  }, [dToken]);

  const filteredRecords = records.filter((r) =>
    r.patientId?.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const pendingCount = records.filter(
    (r) => r.status === "pending"
  ).length;

  const activeCount = records.filter(
    (r) => r.status === "active"
  ).length;

  const totalUpdates = records.reduce(
    (sum, r) => sum + (r.updates?.length || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading Follow-Ups...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Follow-Up Management
        </h2>

        <p className="text-gray-500 mt-1">
          Monitor patient updates and respond quickly
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-gray-500 text-sm">
            Total Records
          </p>
          <h2 className="text-3xl font-bold text-blue-600">
            {records.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-gray-500 text-sm">
            Pending
          </p>
          <h2 className="text-3xl font-bold text-red-500">
            {pendingCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-gray-500 text-sm">
            Active
          </p>
          <h2 className="text-3xl font-bold text-green-500">
            {activeCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-gray-500 text-sm">
            Updates
          </p>
          <h2 className="text-3xl font-bold text-purple-500">
            {totalUpdates}
          </h2>
        </div>

      </div>

      {/* Search */}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search patient by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border rounded-2xl p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredRecords.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            No Follow-Ups Found
          </h3>

          <p className="text-gray-500 mt-2">
            No records match your search.
          </p>
        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredRecords.map((r) => {

            const latestUpdate =
              r.updates?.length > 0
                ? r.updates[r.updates.length - 1]
                : null;

            return (
              <div
                key={r._id}
                onClick={() =>
                  navigate(`/doctor-follow-up/${r._id}`)
                }
                className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 p-5 hover:-translate-y-1"
              >

                <div className="flex justify-between items-start">

                  <div className="flex gap-4">

                    <img
                      src={
                        r.patientId?.image ||
                        "https://ui-avatars.com/api/?name=Patient"
                      }
                      alt=""
                      className="w-16 h-16 rounded-full object-cover border"
                    />

                    <div>

                      <h3 className="font-bold text-xl text-gray-800">
                        {r.patientId?.name || "Unknown Patient"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {r.patientId?.email || "No Email"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {r.patientId?.phone || "No Phone"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Last Update:
                        {latestUpdate
                          ? ` ${new Date(
                              latestUpdate.createdAt
                            ).toLocaleDateString()}`
                          : " No Updates"}
                      </p>

                    </div>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      r.status === "pending"
                        ? "bg-red-100 text-red-600"
                        : r.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {r.status || "active"}
                  </span>

                </div>

                <div className="grid grid-cols-3 gap-3 mt-5">

                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">
                      Updates
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {r.updates?.length || 0}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">
                      Replies
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {r.doctorReplies?.length || 0}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">
                      Prescriptions
                    </p>
                    <p className="text-xl font-bold text-purple-600">
                      {r.prescriptions?.length || 0}
                    </p>
                  </div>

                </div>

                {latestUpdate && (
                  <div className="mt-5 bg-gray-50 rounded-xl p-4">

                    <p className="font-semibold text-gray-700 mb-2">
                      Latest Update
                    </p>

                    <p
                      className={`font-bold ${
                        latestUpdate.painLevel >= 7
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      Pain: {latestUpdate.painLevel}/10
                    </p>

                    <p className="text-sm text-gray-600 mt-2">
                      {latestUpdate.symptoms}
                    </p>

                  </div>
                )}

                <button
                  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                >
                  View Details
                </button>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
};

export default DoctorFollowUps;