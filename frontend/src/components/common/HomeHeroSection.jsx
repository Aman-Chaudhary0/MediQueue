import { ShieldCheck, Clock, Bell } from 'lucide-react'
import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const HomeHeroSection = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const shouldShowBookAppointment = user?.role === 'patient' || !user


// ==========================================================================================================================================================================

    return (
        <div className='max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 py-12 lg:py-20 gap-8 lg:gap-12'>
        <div className='w-full lg:w-1/2'>

            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 lg:mb-4'>Track Your Turn in <span className='text-blue-600'>Real-Time.</span></h1>
            <p className='text-sm sm:text-base text-gray-600 mb-4 lg:mb-6'>Smart Doctor Queue System helps patients book appointments, get real-time updates, and reduce waiting time at hospitals.</p>

            <div className='flex flex-col gap-2 sm:gap-3'>
                {shouldShowBookAppointment && (
                    <button
                        onClick={() => navigate('/patient/book-appointment')}
                        className='w-full sm:w-auto bg-blue-600 text-white py-2.5 px-6 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors font-medium'
                    >
                        Book Appointment
                    </button>
                )}
                <button className='w-full sm:w-auto bg-gray-300 text-gray-800 py-2.5 px-6 text-sm sm:text-base rounded-md hover:bg-gray-400 transition-colors font-medium'>How It Works</button>
            </div>



            <div className='mt-6 lg:mt-10'>


                <div className='flex flex-col  sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8'>
                    <div className='flex items-center space-x-2'>
                        <ShieldCheck className='text-blue-600 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 shrink-0' />
                        <span className='text-xs sm:text-sm text-gray-800'>Safe and Secure</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Clock className='text-blue-600 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 shrink-0' />
                        <span className='text-xs sm:text-sm text-gray-800'>Real-Time Waiting</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Bell className='text-blue-600 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 shrink-0' />
                        <span className='text-xs sm:text-sm text-gray-800'>Smart Notifications</span>
                    </div>
                </div>

            </div>

        </div>
        <div className='w-full lg:w-1/2'>
                        <img src={assets.personSit} alt="Person Sitting" className='w-full h-auto' />
                    </div>
                </div>
        
    )
}

export default HomeHeroSection
