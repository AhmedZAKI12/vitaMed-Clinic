import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const BookAppointment = () => {

  const {
    doctors,
    getAllDoctors,
    adminBookAppointment
  } = useContext(AdminContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [docId, setDocId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    getAllDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !phone ||
      !docId ||
      !date ||
      !time
    ) {
      return toast.error("Fill all fields");
    }

    const [year, month, day] = date.split("-");

    const slotDate = `${day}_${month}_${year}`;

    const result = await adminBookAppointment({
      name,
      email,
      phone,
      docId,
      slotDate,
      slotTime: time,
    });

    if (result.success) {
      toast.success(result.message);

      setName("");
      setEmail("");
      setPhone("");
      setDate("");
      setTime("");
      setDocId("");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="w-full p-8">

      <h1 className="text-3xl font-bold mb-8">
        Book Appointment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md space-y-5"
      >

        <input
          type="text"
          placeholder="Patient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="email"
          placeholder="Patient Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Patient Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <select
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="">Select Doctor</option>

          {doctors.map((doctor) => (
            <option
              key={doctor._id}
              value={doctor._id}
            >
              {doctor.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Book Appointment
        </button>

      </form>

    </div>
  );
};

export default BookAppointment;