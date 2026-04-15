import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

    export const AdminContext = createContext();

    const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");

    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);

    // ================== DOCTORS ==================
    const getAllDoctors = async () => {
        try {
        const { data } = await axios.get(backendUrl + "/api/admin/all-doctors", {
            headers: {
            Authorization: `Bearer ${aToken}`,
            },
        });

        if (data.success) {
            setDoctors(data.doctors);
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        toast.error(error.message);
        }
    };

    const changeAvailability = async (docId) => {
        try {
        const { data } = await axios.post(
            backendUrl + "/api/admin/change-availability",
            { docId },
            {
            headers: {
                Authorization: `Bearer ${aToken}`,
            },
            },
        );

        if (data.success) {
            toast.success(data.message);
            getAllDoctors();
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        toast.error(error.message);
        }
    };

    // ================== APPOINTMENTS ==================
    const getAllAppointments = async () => {
        try {
        const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
            headers: {
            Authorization: `Bearer ${aToken}`,
            },
        });

        if (data.success) {
            setAppointments(data.appointments.reverse());
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        toast.error(error.message);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
        const { data } = await axios.post(
            backendUrl + "/api/admin/cancel-appointment",
            { appointmentId },
            {
            headers: {
                Authorization: `Bearer ${aToken}`,
            },
            },
        );

        if (data.success) {
            toast.success(data.message);
            getAllAppointments();
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        toast.error(error.message);
        }
    };

    // ================== COMPLETE APPOINTMENT ==================
    const completeAppointment = async (appointmentId) => {
        try {
        const { data } = await axios.post(
            backendUrl + "/api/admin/complete-appointment",
            { appointmentId },
            {
            headers: {
                Authorization: `Bearer ${aToken}`,
            },
            },
        );

        if (data.success) {
            toast.success(data.message);
            getAllAppointments(); // refresh list
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        toast.error(error.message);
        }
    };

    // ================== DASHBOARD ==================
    const getDashData = async () => {
        try {
        const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
            headers: {
            Authorization: `Bearer ${aToken}`,
            },
        });

        if (data.success) {
            setDashData(data.dashData);
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        toast.error(error.message);
        }
    };

    const value = {
        aToken,
        setAToken,
        doctors,
        setDoctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        cancelAppointment,
        completeAppointment,
        getDashData,
        dashData,
    };

    return (
        <AdminContext.Provider value={value}>
        {props.children}
        </AdminContext.Provider>
    );
    };

    export default AdminContextProvider;
