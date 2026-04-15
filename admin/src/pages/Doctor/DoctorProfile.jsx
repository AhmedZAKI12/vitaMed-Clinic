    import React, { useContext, useEffect, useState } from "react";
    import { DoctorContext } from "../../context/DoctorContext";
    import { AppContext } from "../../context/AppContext";
    import { toast } from "react-toastify";
    import axios from "axios";

    const DoctorProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData } =
        useContext(DoctorContext);

    const { currency, backendUrl } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);

    const updateProfile = async () => {
        try {
        const updateData = {
            address: profileData.address,
            fees: profileData.fees,
            about: profileData.about,
            available: profileData.available,
        };

        const { data } = await axios.post(
            backendUrl + "/api/doctor/update-profile",
            updateData,
            { headers: { dToken } }
        );

        if (data.success) {
            toast.success(data.message);
            setIsEdit(false);
            getProfileData();
        } else {
            toast.error(data.message);
        }
        } catch (error) {
        toast.error(error.message);
        console.log(error);
        }
    };

    useEffect(() => {
        if (dToken) {
        getProfileData();
        }
    }, [dToken]);

    return (
        profileData && (
        <div className="p-6">

            {/* MAIN CARD */}

            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

            {/* HEADER */}

            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8 flex items-center gap-6 text-white">

                <img
                className="w-28 h-28 rounded-xl object-cover border-4 border-white shadow-md"
                src={profileData.image}
                alt=""
                />

                <div>

                <h2 className="text-3xl font-bold">
                    {profileData.name}
                </h2>

                <p className="text-sm opacity-90">
                    {profileData.degree} • {profileData.speciality}
                </p>

                <span className="bg-white/20 px-3 py-1 rounded-full text-xs mt-2 inline-block">
                    {profileData.experience} Experience
                </span>

                </div>

            </div>

            {/* CONTENT */}

            <div className="p-8 grid md:grid-cols-2 gap-8">

                {/* ABOUT CARD */}

                <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">

                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    About Doctor
                </h3>

                {isEdit ? (
                    <textarea
                    rows="6"
                    className="w-full border rounded-lg p-3 outline-indigo-500"
                    value={profileData.about}
                    onChange={(e) =>
                        setProfileData((prev) => ({
                        ...prev,
                        about: e.target.value,
                        }))
                    }
                    />
                ) : (
                    <p className="text-gray-600 leading-relaxed">
                    {profileData.about}
                    </p>
                )}

                </div>

                {/* RIGHT COLUMN */}

                <div className="flex flex-col gap-6">

                {/* FEES */}

                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-5 rounded-xl shadow-md flex justify-between items-center">

                    <div>

                    <p className="text-sm opacity-90">
                        Appointment Fee
                    </p>

                    {isEdit ? (
                        <input
                        type="number"
                        className="mt-2 text-black p-2 rounded w-24"
                        value={profileData.fees}
                        onChange={(e) =>
                            setProfileData((prev) => ({
                            ...prev,
                            fees: e.target.value,
                            }))
                        }
                        />
                    ) : (
                        <h2 className="text-2xl font-bold">
                        {currency} {profileData.fees}
                        </h2>
                    )}

                    </div>

                    <div className="text-4xl opacity-40">
                    
                    </div>

                </div>

                {/* ADDRESS */}

                <div className="bg-gray-50 border rounded-xl p-5 hover:shadow-md transition">

                    <p className="font-semibold text-gray-800 mb-2">
                    Address
                    </p>

                    {isEdit ? (
                    <div className="flex flex-col gap-2">

                        <input
                        className="border p-2 rounded"
                        value={profileData.address.line1}
                        onChange={(e) =>
                            setProfileData((prev) => ({
                            ...prev,
                            address: {
                                ...prev.address,
                                line1: e.target.value,
                            },
                            }))
                        }
                        />

                        <input
                        className="border p-2 rounded"
                        value={profileData.address.line2}
                        onChange={(e) =>
                            setProfileData((prev) => ({
                            ...prev,
                            address: {
                                ...prev.address,
                                line2: e.target.value,
                            },
                            }))
                        }
                        />

                    </div>
                    ) : (
                    <p className="text-gray-600">
                        📍 {profileData.address.line1}
                        <br />
                        {profileData.address.line2}
                    </p>
                    )}

                </div>

                {/* AVAILABILITY */}

                <div className="flex items-center justify-between bg-white border rounded-xl p-4">

                    <p className="font-medium text-gray-700">
                    Doctor Availability
                    </p>

                    <div className="flex items-center gap-3">

                    <input
                        type="checkbox"
                        checked={profileData.available}
                        onChange={() =>
                        isEdit &&
                        setProfileData((prev) => ({
                            ...prev,
                            available: !prev.available,
                        }))
                        }
                        className="w-4 h-4 accent-indigo-600"
                    />

                    <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                        profileData.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                    >
                        {profileData.available ? "Available" : "Offline"}
                    </span>

                    </div>

                </div>

                </div>

            </div>

            {/* ACTION BUTTON */}

            <div className="p-6 border-t flex justify-end">

                {isEdit ? (
                <button
                    onClick={updateProfile}
                    className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                    Save Changes
                </button>
                ) : (
                <button
                    onClick={() => setIsEdit(true)}
                    className="px-6 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                >
                    Edit Profile
                </button>
                )}

            </div>

            </div>

        </div>
        )
    );
    };

    export default DoctorProfile;