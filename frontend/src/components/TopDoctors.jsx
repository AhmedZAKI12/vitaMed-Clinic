import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {

    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    return (
        <div className='flex flex-col items-center gap-4 my-20 text-[#262626] px-4'>

            {/* 🔥 Title */}
            <h1 className='text-3xl md:text-4xl font-extrabold 
            bg-gradient-to-r from-blue-600 to-indigo-600 
            bg-clip-text text-transparent'>
                Top Rated Doctors
            </h1>

            <p className='text-center text-gray-500 max-w-md text-sm md:text-base leading-relaxed font-medium tracking-wide'>
    Browse <span className="text-blue-600 font-semibold">trusted doctors</span>, 
    check ratings, and book your appointment in seconds.
</p>

            {/* 🔥 Grid */}
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8 max-w-6xl'>

                {doctors.slice(0, 12).map((item, index) => (

                    <div
                        key={index}
                        onClick={() => {
                            navigate(`/appointment/${item._id}`)
                            scrollTo(0, 0)
                        }}
                        className='group bg-white rounded-3xl shadow-md hover:shadow-2xl 
                        transition duration-500 overflow-hidden cursor-pointer hover:-translate-y-2'
                    >

                        {/* 🔥 Image */}
                        <div className='relative overflow-hidden'>

                            <img
                                className='w-full h-52 object-cover transition duration-500 group-hover:scale-110'
                                src={item.image}
                                alt=""
                            />

                            {/* overlay */}
                            <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent'></div>

                            {/* availability badge */}
                            <span className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full text-white shadow
                                ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}>
                                {item.available ? 'Available' : 'Offline'}
                            </span>

                        </div>

                        {/* 🔥 Content */}
                        <div className='p-5 flex flex-col gap-2'>

                            {/* name */}
                            <h3 className='text-lg font-bold text-gray-800 group-hover:text-blue-600 transition'>
                                {item.name}
                            </h3>

                            {/* speciality */}
                            <p className='text-sm text-gray-500'>
                                {item.speciality}
                            </p>

                            {/* rating */}
                            <div className='flex items-center gap-2 mt-1'>
                                <span className='text-yellow-400 text-lg'>⭐</span>
                                <span className='text-sm font-medium text-gray-600'>
                                    {item.rating ? item.rating.toFixed(1) : "No rating"}
                                </span>
                            </div>

                            {/* 🔥 Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/appointment/${item._id}`)
                                }}
                                className='mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-full 
                                hover:scale-105 hover:shadow-lg transition duration-300 text-sm'
                            >
                                Book Appointment
                            </button>

                        </div>

                    </div>

                ))}

            </div>

            {/* 🔥 More Button */}
            <button
                onClick={() => {
                    navigate('/doctors')
                    scrollTo(0, 0)
                }}
                className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-3 rounded-full mt-10 
                hover:scale-105 hover:shadow-lg transition duration-300'
            >
                Explore More
            </button>

        </div>
    )
}

export default TopDoctors