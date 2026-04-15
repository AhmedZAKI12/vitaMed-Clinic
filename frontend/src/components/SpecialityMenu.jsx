    import React from 'react'
    import { specialityData } from '../assets/assets'
    import { FaUserMd, FaFemale, FaBrain, FaBaby, FaStethoscope } from 'react-icons/fa'

    const SpecialityMenu = ({ setSelectedSpeciality }) => {

    const icons = {
        "General physician": <FaUserMd />,
        "Gynecologist": <FaFemale />,
        "Dermatologist": <FaUserMd />,
        "Pediatricians": <FaBaby />,
        "Neurologist": <FaBrain />,
        "Gastroenterologist": <FaStethoscope />
    }

    return (
        <div id='speciality' className='py-20 px-6'>

        {/* 🔥 Title */}
        <div className='text-center mb-12'>
            <h1 className='text-3xl md:text-4xl font-extrabold 
            bg-gradient-to-r from-blue-600 to-indigo-600 
            bg-clip-text text-transparent inline-block'>
            Discover Medical Specialties
            </h1>

            <p className='text-gray-500 mt-3 text-sm md:text-base max-w-xl mx-auto'>
            Browse different specialties and connect with top-rated doctors easily.
            </p>
        </div>

        {/* 🔥 Grid بدل scroll */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 max-w-6xl mx-auto'>

            {specialityData.map((item, index) => (

            <div
                key={index}
                onClick={() => setSelectedSpeciality(item.speciality)}
                className='group cursor-pointer flex flex-col items-center p-4 rounded-2xl 
                bg-white shadow-sm hover:shadow-xl 
                transition duration-300 hover:-translate-y-2'
            >

                {/* 🔥 Icon بدل الصورة */}
                <div className='w-16 h-16 flex items-center justify-center rounded-full 
                bg-blue-50 text-blue-600 text-2xl 
                group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 
                group-hover:text-white transition duration-300 shadow-md'>

                {icons[item.speciality] || <FaUserMd />}

                </div>

                {/* 🔥 Text */}
                <p className='mt-3 text-sm font-semibold text-gray-700 
                group-hover:text-blue-600 transition duration-300 text-center'>
                {item.speciality}
                </p>

            </div>

            ))}

        </div>

        </div>
    )
    }

    export default SpecialityMenu