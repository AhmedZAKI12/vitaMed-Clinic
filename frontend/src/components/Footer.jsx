import React from 'react'
import { FaFacebookF, FaWhatsapp, FaUserMd, FaCalendarCheck, FaHeartbeat, FaStethoscope } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-[#0b1120] text-white mt-16 relative overflow-hidden opacity-0 translate-y-10 animate-fadeIn">

      {/* Glow Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-blue-600/10 to-transparent pointer-events-none"></div>

      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">

        {/* Brand */}
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            VitaMed Clinic
          </h2>

          <p className="mt-5 text-gray-400 text-sm leading-relaxed max-w-sm">
            Find trusted doctors, explore specialties, and book your appointments
            in seconds — all in one place.
          </p>

          {/* Social */}
          <div className="flex gap-4 mt-6">

            <a
              href="https://www.facebook.com/share/1HzjA3aUA2/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full 
              bg-white/10 hover:bg-blue-500 hover:scale-110 
              transition duration-300 cursor-pointer"
            >
              <FaFacebookF size={14} />
            </a>

          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-white">
            Services
          </h3>

          <ul className="space-y-4 text-gray-400 text-sm">

            <li className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition duration-300 cursor-pointer">
              <FaUserMd className="text-blue-400" />
              Find Doctors
            </li>

            <li className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition duration-300 cursor-pointer">
              <FaCalendarCheck className="text-blue-400" />
              Book Appointment
            </li>

            <li className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition duration-300 cursor-pointer">
              <FaHeartbeat className="text-blue-400" />
              Health Follow-UP
            </li>

            <li className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition duration-300 cursor-pointer">
              <FaStethoscope className="text-blue-400" />
              Medical Specialists
            </li>

          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-5">
            Contact Us
          </h3>

          <div className="space-y-3 text-gray-400 text-sm">
            <p className="flex items-center gap-2">
              📞 <span>01010083448</span>
            </p>

            <p className="flex items-center gap-2">
              📧 <span>vitamedclinic085@gmail.com</span>
            </p>
          </div>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/201010083448?text=Hello%20VitaMed%20Clinic,%20I%20need%20support"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full 
            bg-gradient-to-r from-green-500 to-emerald-400 
            text-white text-sm font-medium 
            shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]
            hover:scale-105 transition duration-300"
          >
            <FaWhatsapp className="text-lg" />
            Get Support
          </a>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 text-center py-5 text-sm text-gray-500">
        © 2026 VitaMed Clinic. All rights reserved.
      </div>

      {/* Animation */}
      <style>
        {`
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        `}
      </style>

    </footer>
  )
}

export default Footer