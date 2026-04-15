    import React from 'react'

    const Header = () => {
    return (
        <div className='mt-10 flex flex-col md:flex-row items-center 
        bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#2563eb] 
        rounded-3xl px-6 md:px-12 lg:px-20 py-14 overflow-hidden'>

        {/* -------- Left -------- */}
        <div className='md:w-1/2 flex flex-col gap-6'>

            {/* 🔥 Title */}
            <h1 className='text-3xl md:text-5xl font-extrabold text-white leading-tight group cursor-default'>
            
            <span className='block transition duration-300 group-hover:translate-x-1'>
                Better Care Starts
            </span>

            <span className='block text-blue-200 transition duration-300 group-hover:translate-x-2'>
                with the Right Doctor
            </span>

            </h1>

            {/* 🔥 Description */}
            <p className='text-white/80 max-w-lg text-sm md:text-base leading-relaxed transition duration-300 hover:text-white'>
            VitaMed Clinic connects you with certified doctors, helping you book
            appointments quickly and easily without hassle.
            </p>

            {/* 🔥 Buttons */}
            <div className='flex gap-4 mt-3 flex-wrap'>

            <a
                href='/doctors'
                className='bg-white text-[#1e3a8a] px-6 py-3 rounded-full shadow-md 
                hover:scale-105 hover:shadow-xl transition duration-300 font-medium'
            >
                Find a Doctor
            </a>

            <a
                href='#speciality'
                className='border border-white/40 text-white px-6 py-3 rounded-full 
                hover:bg-white hover:text-[#1e3a8a] transition duration-300'
            >
                View Services
            </a>

            </div>

            {/* 🔥 Features */}
            <div className='flex flex-wrap gap-3 mt-5'>

            <div className='flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white text-sm transition hover:bg-white/20 hover:scale-105'>
                👨‍⚕️ Trusted Doctors
            </div>

            <div className='flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white text-sm transition hover:bg-white/20 hover:scale-105'>
                ⚡ Instant Booking
            </div>

            <div className='flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white text-sm transition hover:bg-white/20 hover:scale-105'>
                🕒 24/7 Support
            </div>

            </div>

        </div>

        {/* -------- Right -------- */}
        <div className='md:w-1/2 flex items-center justify-center mt-10 md:mt-0'>

            {/* 🔥 كارد الصورة */}
            <div className='relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl group'>

            {/* 🔥 الصورة (نظيفة + hover طبيعي) */}
            <img
                src="/doctors.jpeg"
                alt="Doctors"
                className='w-full h-full object-cover 
                transition duration-500 ease-in-out 
                group-hover:scale-105'
            />

            {/* 🔥 Overlay خفيف */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent'></div>

            </div> 

        </div>

        </div>
    )
    }

    export default Header