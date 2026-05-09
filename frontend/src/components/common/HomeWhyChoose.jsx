import React from 'react'
import { Bell, Zap, Heart, ChartLine } from 'lucide-react'


const HomeWhyChoose = () => {
  return (
     <div className='max-w-4xl mx-auto px-4 py-12 lg:py-20'>
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-8 lg:mb-12 text-center'>Why Choose MediQueue?</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
                        <div className='flex flex-col items-center space-y-3 text-center'>
                            <div className='bg-blue-100 p-3 rounded-full'>
                                <Zap className='text-blue-900 h-6 w-6 sm:h-8 sm:w-8' />
                            </div>
                            <span className='text-sm sm:text-base text-gray-800 font-bold'>Real-Time Queue</span>
                            <p className='text-xs sm:text-sm text-gray-600'>Stay updated with real-time queue status and waiting times.</p>
                        </div>
                        <div className='flex flex-col items-center space-y-3 text-center'>
                            <div className='bg-green-100 p-3 rounded-full'>
                                <Heart className='text-green-600 h-6 w-6 sm:h-8 sm:w-8' />
                            </div>
                            <span className='text-sm sm:text-base text-gray-800 font-bold'>Priority Handling</span>
                            <p className='text-xs sm:text-sm text-gray-600'>Ensure timely service with our priority handling system.</p>
                        </div>
                        <div className='flex flex-col items-center space-y-3 text-center'>
                            <div className='bg-violet-100 p-3 rounded-full'>
                                <Bell className='text-violet-800 h-6 w-6 sm:h-8 sm:w-8' />
                            </div>
                            <span className='text-sm sm:text-base text-gray-800 font-bold'>Smart Alerts</span>
                            <p className='text-xs sm:text-sm text-gray-600'>Never miss an update with our intelligent alert system.</p>
                        </div>
                        <div className='flex flex-col items-center space-y-3 text-center'>
                            <div className='bg-orange-100 p-3 rounded-full'>
                                <ChartLine className='text-orange-600 h-6 w-6 sm:h-8 sm:w-8' />
                            </div>
                            <span className='text-sm sm:text-base text-gray-800 font-bold'>Analytics Dashboard</span>
                            <p className='text-xs sm:text-sm text-gray-600'>Gain insights with our comprehensive analytics dashboard.</p>
                        </div>
                    </div>
                </div>
  )
}

export default HomeWhyChoose