import React from 'react'
import Navbar from '../../components/Navbar'
import { assets } from '../../assets/assets'
import { Clock, ShieldCheck, Bell, CalendarDays, TicketPercent, Laptop2, Zap, Heart, ChartLine } from 'lucide-react'

const Home = () => {
    return (
        <div>
            <Navbar />
            
            {/* // MAKE IT RESPONSIVE LATER */}

            <div className=' bg-gray-100'>
                <div className='max-w-4xl mx-auto flex items-center justify-between px-4 py-15'>


                    {/* =======================HERO SECTION==================== */}
                    <div className='w-1/2'>

                        <h1 className='text-4xl font-bold text-gray-800 mb-4'>Track Your Turn in <span className='text-blue-600'>Real-Time.</span></h1>
                        <p className='text-gray-600 mb-6'>Smart Doctor Queue System helps patients book appointments, get real-time updates, and reduce waiting time at hospitals.</p>

                        <div className='space-x-4'>
                            <button className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700'>Book Appointment</button>
                            <button className='bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400'>How It Works</button>
                        </div>

                    

                        <div className='mt-10'>

                            
                            <div className='flex items-center space-x-8'>
                                <div className='flex items-center space-x-2'>
                                    <ShieldCheck className='text-blue-600 h-12 w-12' />
                                    <span className='text-sm text-gray-800'>Safe and Secure</span>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <Clock className='text-blue-600 h-12 w-12' />
                                    <span className='text-sm text-gray-800'>Real-Time Waiting</span>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <Bell className='text-blue-600 h-12 w-12' />
                                    <span className='text-sm text-gray-800'>Smart Notifications</span>
                                </div>
                            </div>

                        </div>

                    </div>


        {/* ==========================HERO SECTION==================== */}
                    <div className='w-1/2'>
                        <img src={assets.personSit} alt="Person Sitting" className='w-full h-auto' />
                    </div>
                </div>


                {/* ====================HOW IT WORKS SECTION==================== */}

                <div className='max-w-4xl mx-auto px-4 py-15'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-4 text-center '>How It Works?</h2>
                    <div className='flex items-center space-x-8'>
                        <div className='flex flex-col items-center space-y-2'>
                            <CalendarDays className='text-blue-600 h-12 w-12' />
                            <span className='text-sm text-gray-800 font-bold'>Book Appointment</span>
                            <p className='text-sm text-gray-600 text-center'>Easily book your appointment with just a few clicks.</p>
                        </div>
                        
                        <div className='flex flex-col items-center space-y-2'>
                            <TicketPercent className='text-blue-600 h-12 w-12' />
                            <span className='text-sm text-gray-800 font-bold'>Get Your Token</span>
                            <p className='text-sm text-gray-600 text-center'>Receive your unique token for the queue.</p>
                        </div>

                        <div className='flex flex-col items-center space-y-2'>
                            <Laptop2 className='text-blue-600 h-12 w-12' />
                            <span className='text-sm text-gray-800 font-bold'>Track Live Queue</span>
                            <p className='text-sm text-gray-600 text-center'>Monitor your position in the real-time queue.</p>
                        </div>
                    </div>
                </div>


                {/* ====================WHY CHOOSE US SECTION==================== */}

                <div className='max-w-4xl mx-auto px-4 py-15'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-4 text-center '>Why Choose MediQueue?</h2>
                    <div className='flex items-center space-x-8'>
                        <div className='flex flex-col items-center space-y-2'>
                            <Zap className='text-blue-900 h-12 w-12' />
                            <span className='text-sm text-gray-800 font-bold'>Real-Time Queue</span>
                            <p className='text-sm text-gray-600 text-center'>Stay updated with real-time queue status and waiting times.</p>
                        </div>
                        <div className='flex flex-col items-center space-y-2'>
                            <Heart className='text-green-600  h-12 w-12' />
                            <span className='text-sm text-gray-800 font-bold'>Priority Handling</span>
                            <p className='text-sm text-gray-600 text-center'>Ensure timely service with our priority handling system.</p>
                        </div>
                        <div className='flex flex-col items-center space-y-2'>
                            <Bell className='text-violet-800 h-12 w-12' />
                            <span className='text-sm text-gray-800 font-bold'>Smart Alerts</span>
                            <p className='text-sm text-gray-600 text-center'>Never miss an update with our intelligent alert system.</p>
                        </div>
                        <div className='flex flex-col items-center space-y-2'>
                            <ChartLine className='text-orange-600 h-12 w-12' />
                            <span className='text-sm text-gray-800 font-bold'>Analytics Dashboard</span>
                            <p className='text-sm text-gray-600 text-center'>Gain insights with our comprehensive analytics dashboard.</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Home