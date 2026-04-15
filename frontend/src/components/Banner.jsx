import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <div className='relative overflow-visible 
        bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#2563eb] 
        rounded-2xl px-6 sm:px-10 md:px-14 lg:px-16 my-24 md:mx-10 
        flex items-center min-h-[320px]'>

            {/* ------- Left ------- */}
            <div className='flex-1 py-12 md:py-16 lg:py-20 z-10'>

                <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight'>
                    Book Smarter.  
                    <span className='block text-blue-300 mt-2'>
                        Choose the Right Doctor
                    </span>
                </h1>

                <p className='mt-6 text-blue-100 text-sm md:text-base max-w-md leading-relaxed'>
                    Discover top-rated doctors, read real reviews, and book your appointment
                    in seconds — no waiting, no hassle.
                </p>

                <button
                    onClick={() => { navigate('/login'); scrollTo(0, 0) }}
                    className='mt-8 px-8 py-3 rounded-full 
                    bg-white text-blue-600 font-semibold 
                    shadow-xl 
                    hover:shadow-2xl 
                    hover:scale-110 
                    active:scale-95
                    transition duration-300'
                >
                    Get Started →
                </button>

            </div>

            {/* ------- Right ------- */}
            <div className='hidden md:block md:w-1/2 relative h-full'>

                <img
                    src={assets.appointment_img}
                    alt=""
                    className='absolute 
                    right-6
                    top-1/2 
                    -translate-y-[55%]

                    w-[360px] lg:w-[420px]

                    drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)]
                    transition duration-500
                    hover:scale-105
                    animate-float'
                />

            </div>

            {/* animation */}
            <style>
                {`
                @keyframes float {
                    0% { transform: translateY(-55%) translateY(0px); }
                    50% { transform: translateY(-55%) translateY(-12px); }
                    100% { transform: translateY(-55%) translateY(0px); }
                }

                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                `}
            </style>

        </div>
    )
}

export default Banner