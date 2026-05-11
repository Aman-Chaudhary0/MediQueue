import React from 'react'
import { Clock, Bell, Users } from 'lucide-react'
import { assets } from '../../assets/assets'
assets


const AuthHeader = () => {
    return (
        <div className='w-full lg:w-1/2 relative hidden lg:block'>
            {/* =============== LOGO  =========================== */}
            <div>
                <img src={assets.hospital_lobby} alt="hospital lobby" className='w-full h-screen object-cover rounded-2xl' />

                <div className='absolute top-0 left-0 m-2 sm:m-4 flex items-center'>
                    <img src={assets.homepage_logo} alt="logo" className='w-8 sm:w-12 h-8 sm:h-12 mr-2 rounded-full' />
                    <div>
                        <h1 className='text-lg sm:text-2xl font-semibold'>Medi<span className='text-blue-800'>Queue</span></h1>
                        <p className='text-xs sm:text-sm italic'>Your health, our priority</p>
                    </div>
                </div>
            </div>


            {/* // =============== TEXT OVERLAY  =========================== */}
            <div className='absolute top-16 sm:top-27 left-0 m-2 sm:m-4'>
                <h1 className='text-2xl sm:text-4xl font-bold mb-2'>Skip the Wait, <br /> <span className='text-blue-800'>Save Your Time.</span></h1>
                <p className='relative text-xs sm:text-sm italic'>Book appointments, track your queue in real-time, ans get the best healthcare experience.</p>
            </div>


            {/* ============================== FEATURES HIGHLIGHT =========================== */}
            <div className='absolute bottom-10 left-0 m-2 sm:m-4 flex flex-col space-y-4 sm:space-y-8'>
                <div className='flex items-center space-x-3 sm:space-x-4'>
                    <Users className='w-8 sm:w-12 h-8 sm:h-12 text-blue-600 bg-blue-200 rounded-full shrink-0' />
                    <div>
                        <h3 className='text-base sm:text-lg font-semibold'>Real-Time Queue</h3>
                        <p className='text-xs sm:text-sm italic'>Track your position in the queue and get notified when it's your turn.</p>
                    </div>
                </div>
                <div className='flex items-center space-x-3 sm:space-x-4'>
                    <Clock className='w-8 sm:w-12 h-8 sm:h-12 text-blue-600 bg-blue-200 rounded-full shrink-0' />
                    <div>
                        <h3 className='text-base sm:text-lg font-semibold'>Easy Booking</h3>
                        <p className='text-xs sm:text-sm italic'>Book appointments with your preferred healthcare providers in just a few clicks.</p>
                    </div>
                </div>
                <div className='flex items-center space-x-3 sm:space-x-4'>
                    <Bell className='w-8 sm:w-12 h-8 sm:h-12 text-blue-600 bg-blue-200 rounded-full shrink-0' />
                    <div>
                        <h3 className='text-base sm:text-lg font-semibold'>Health Records</h3>
                        <p className='text-xs sm:text-sm italic'>Access your health records and appointment history anytime, anywhere.</p>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default AuthHeader