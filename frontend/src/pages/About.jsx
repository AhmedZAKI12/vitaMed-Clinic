    import React from "react";

    const About = () => {
    return (
        <div className="px-6 md:px-12 lg:px-20 py-16">

        {/* ===== TITLE ===== */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            About <span className="text-blue-600">VitaMed Clinic</span>
            </h1>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            A smarter way to connect with trusted doctors and manage your healthcare easily.
            </p>
        </div>

        {/* ===== ABOUT SECTION ===== */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-16">

            {/* Image */}
            <div className="md:w-1/2">
            <img
                src="https://img.freepik.com/free-photo/medical-team_23-2148827771.jpg"
                alt="clinic"
                className="rounded-2xl shadow-lg hover:scale-105 transition duration-500"
            />
            </div>

            {/* Text */}
            <div className="md:w-1/2 max-w-2xl space-y-5 text-gray-600 leading-relaxed">

            <p>
                VitaMed Clinic is a modern healthcare platform dedicated to transforming
                the way patients connect with medical professionals. Our clinic combines
                advanced technology with trusted medical expertise to deliver a seamless
                and reliable healthcare experience.
            </p>

            <p>
                We understand that finding the right doctor and scheduling appointments
                can be time-consuming and stressful. That’s why we’ve built a system that
                simplifies the entire process — allowing patients to browse, compare, and
                book appointments with ease.
            </p>

            <p>
                At VitaMed Clinic, we prioritize quality, efficiency, and patient
                satisfaction. Our network includes highly qualified doctors across
                multiple specialities, ensuring that every patient receives the care
                they deserve — quickly and confidently.
            </p>

            {/* Vision */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4">
                Our Vision
                </h3>
                <p>
                To become a leading digital healthcare platform that bridges the gap
                between patients and doctors, making healthcare accessible, efficient,
                and stress-free for everyone.
                </p>
            </div>

            {/* Mission */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4">
                Our Mission
                </h3>
                <p>
                Our mission is to empower patients by providing a smart and user-friendly
                platform where they can find trusted doctors, manage appointments,
                and take control of their healthcare journey with confidence.
                </p>
            </div>

            </div>
        </div>

        {/* ===== WHY CHOOSE US ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="font-semibold text-blue-600 mb-2">
                Trusted Doctors
            </h3>
            <p className="text-gray-500 text-sm">
                Work with experienced and verified professionals.
            </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="font-semibold text-blue-600 mb-2">
                Easy Booking
            </h3>
            <p className="text-gray-500 text-sm">
                Book appointments in seconds without hassle.
            </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="font-semibold text-blue-600 mb-2">
                Smart Experience
            </h3>
            <p className="text-gray-500 text-sm">
                Clean and modern interface for smooth usage.
            </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="font-semibold text-blue-600 mb-2">
                24/7 Support
            </h3>
            <p className="text-gray-500 text-sm">
                We are always here to help and support you.
            </p>
            </div>

        </div>

        {/* ===== CTA ===== */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 
        rounded-2xl p-10 text-center text-white shadow-lg">

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Book Your Appointment?
            </h2>

            <p className="mb-6 text-blue-100">
            Find the right doctor and start your healthcare journey today.
            </p>

            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold 
            hover:scale-105 transition">
            Get Started →
            </button>

        </div>

        </div>
    );
    };

    export default About;