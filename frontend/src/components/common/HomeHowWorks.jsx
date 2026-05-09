import { CalendarDays, TicketPercent, Laptop2 } from 'lucide-react'
import React from 'react'


const HomeHowWorks = () => {
  return (
      <div className='max-w-4xl mx-auto px-4 py-12 lg:py-20 bg-white'>
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-8 lg:mb-12 text-center'>How It Works?</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8'>
                        <div className='flex flex-col items-center space-y-3 text-center'>
                            <div className='bg-blue-100 p-3 rounded-full'>
                                <CalendarDays className='text-blue-600 h-6 w-6 sm:h-8 sm:w-8' />
                            </div>
                            <span className='text-sm sm:text-base text-gray-800 font-bold'>Book Appointment</span>
                            <p className='text-xs sm:text-sm text-gray-600'>Easily book your appointment with just a few clicks.</p>
                        </div>

                        <div className='flex flex-col items-center space-y-3 text-center'>
                            <div className='bg-blue-100 p-3 rounded-full'>
                                <TicketPercent className='text-blue-600 h-6 w-6 sm:h-8 sm:w-8' />
                            </div>
                            <span className='text-sm sm:text-base text-gray-800 font-bold'>Get Your Token</span>
                            <p className='text-xs sm:text-sm text-gray-600'>Receive your unique token for the queue.</p>
                        </div>

                        <div className='flex flex-col items-center space-y-3 text-center'>
                            <div className='bg-blue-100 p-3 rounded-full'>
                                <Laptop2 className='text-blue-600 h-6 w-6 sm:h-8 sm:w-8' />
                            </div>
                            <span className='text-sm sm:text-base text-gray-800 font-bold'>Track Live Queue</span>
                            <p className='text-xs sm:text-sm text-gray-600'>Monitor your position in the real-time queue.</p>
                        </div>
                    </div>
                </div>
  )
}

export default HomeHowWorks