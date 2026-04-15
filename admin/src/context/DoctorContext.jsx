    import { createContext, useState } from "react";
    import axios from "axios";
    import { toast } from "react-toastify";

    export const DoctorContext = createContext();

    const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(
        localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
    );
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [profileData, setProfileData] = useState(false);

    // =========================
    // Get Doctor Appointments
    // =========================
    const getAppointments = async () => {
        try {
        const { data } = await axios.get(
            backendUrl + "/api/doctor/appointments",
            { headers: { dToken } }
        );

        if (data.success) {
            setAppointments(data.appointments.reverse());
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        console.log(error);
        toast.error(error.message);
        }
    };

    // =========================
    // Get Doctor Profile
    // =========================
    const getProfileData = async () => {
        try {
        const { data } = await axios.get(
            backendUrl + "/api/doctor/profile",
            { headers: { dToken } }
        );
        setProfileData(data.profileData);
        } catch (error) {
        console.log(error);
        toast.error(error.message);
        }
    };

    // =========================
    // Cancel Appointment
    // =========================
    const cancelAppointment = async (appointmentId) => {
        try {
        const { data } = await axios.post(
            backendUrl + "/api/doctor/cancel-appointment",
            { appointmentId },
            { headers: { dToken } }
        );

        if (data.success) {
            getAppointments();
            getDashData();
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        console.log(error);
        toast.error(error.message);
        }
    };

    // =========================
    // Confirm Appointment ✅
    // =========================
    const confirmAppointment = async (appointmentId) => {
        try {
        const { data } = await axios.post(
            backendUrl + "/api/doctor/confirm-appointment",
            { appointmentId },
            { headers: { dToken } }
        );

        if (data.success) {
            getAppointments();
            getDashData();
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        console.log(error);
        toast.error(error.message);
        }
    };

    // =========================
    // Complete Appointment
    // =========================
    const completeAppointment = async (appointmentId) => {
        try {
        const { data } = await axios.post(
            backendUrl + "/api/doctor/complete-appointment",
            { appointmentId },
            { headers: { dToken } }
        );

        if (data.success) {
            getAppointments();
            getDashData();
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        console.log(error);
        toast.error(error.message);
        }
    };

    // =========================
    // Doctor Dashboard
    // =========================
    const getDashData = async () => {
        try {
        const { data } = await axios.get(
            backendUrl + "/api/doctor/dashboard",
            { headers: { dToken } }
        );

        if (data.success) {
            setDashData(data.dashData);
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        console.log(error);
        toast.error(error.message);
        }
    };

    // =========================
    // Context Value
    // =========================
    const value = {
        dToken,
        setDToken,
        backendUrl,

        appointments,
        getAppointments,

        cancelAppointment,
        confirmAppointment, // ✅ مهم
        completeAppointment,

        dashData,
        getDashData,

        profileData,
        setProfileData,
        getProfileData,
    };

    return (
        <DoctorContext.Provider value={value}>
        {props.children}
        </DoctorContext.Provider>
    );
    };

    export default DoctorContextProvider;