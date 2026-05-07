import { UserRound, Search, CalendarCheck, Clock, CircleDollarSign } from 'lucide-react'
import { assets } from '../../assets/assets'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

const BookAppointment = () => {
    const [startDate, setStartDate] = useState(new Date());

    return (



        <div className='p-6 m-4 '>

            {/* ================ = Book Appointment Page ================ */}
            <h1 className='text-3xl font-bold mb-4'>Book an Appointment</h1>
            <p className='text-sm italic mb-6'>Select a doctor and schedule your appointment</p>


            {/* =============================== Stepper ============================== */}
            <div className='flex items-center space-x-4 mb-8 justify-center'>
                <div className='flex items-center space-x-2'>
                    <div className='w-8 h-8 rounded-full bg-gray-200 text-black flex items-center justify-center'>1</div>
                    <p className='text-sm'>Select Doctor</p>
                </div>
                <hr className='bg-gray-500 w-1/20 h-0.5' />

                <div className='flex items-center space-x-2'>
                    <div className='w-8 h-8 rounded-full bg-gray-200 text-black flex items-center justify-center'>2</div>
                    <p className='text-sm'>Choose Date</p>
                </div>
                <hr className='bg-gray-500 w-1/20 h-0.5' />

                <div className='flex items-center space-x-2'>
                    <div className='w-8 h-8 rounded-full bg-gray-200 text-black flex items-center justify-center'>3</div>
                    <p className='text-sm'>Select Time</p>
                </div>
                <hr className='bg-gray-500 w-1/20 h-0.5' />

                <div className='flex items-center space-x-2'>
                    <div className='w-8 h-8 rounded-full bg-gray-200 text-black flex items-center justify-center'>4</div>
                    <p className='text-sm'>Confirm Details</p>
                </div>

            </div>




            

            {/* =============================== DOCTOR SELECTION ==============================  */}

            <div className='mb-8 border-t border-gray-300 p-8 shadow-2xl rounded' >
            <div className='flex items-center justify-between mb-4 '>
                <h2 className='text-2xl font-semibold'>1. Select a Doctor</h2>

                <div className='relative w-1/3 '>
                    <input type="text" placeholder='Search by name or speciality' className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600' />
                    <button className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'>
                        <Search className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* =================  ============= DOCTOR CARDS ============================== */}
            <div className='flex space-x-4 overflow-x-auto mb-8'>
                <div className='min-w-50 p-4 bg-white rounded-lg shadow-md'>
                    <UserRound className='w-full h-32 object-cover rounded-md mb-4' />
                    <h2 className='text-lg font-semibold text-center'>Dr. John Doe</h2>
                    <p className='text-sm text-gray-600 text-center'>Cardiologist</p>
                    <p className='text-sm text-gray-600 text-center'>City Hospital</p>
                    <p className='text-sm text-gray-600 text-center'>10 years experience</p>
                </div>

                <div className='min-w-50 p-4 bg-white rounded-lg shadow-md'>
                    <UserRound className='w-full h-32 object-cover rounded-md mb-4' />
                    <h2 className='text-lg font-semibold text-center'>Dr. Jane Smith</h2>
                    <p className='text-sm text-gray-600 text-center'>Dermatologist</p>
                    <p className='text-sm text-gray-600 text-center'>Green Clinic</p>
                </div>


            </div>
            </div>


            {/* ==========================CHOOSE DATE & TIME============================== */}

            <div className='flex items-start space-x-8 mb-8 border-t border-gray-300 p-8 shadow-2xl rounded'>
                <div className='w-1/2'>
                    <h2 className='text-2xl font-semibold mb-4'>2. Choose Date & Time</h2>
                    <div className='flex items-center space-x-4 mb-4'>

                        {/* =============================== DATE PICKER ==============================  */}
                        <DatePicker className='w-200'
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            inline
                        />

                        {/* =================== AVAILABLE SLOTS ============================== */}
                        <div className='flex flex-col items-center space-x-4 ml-5'>
                            <div className=' p-4 bg-green-100 rounded-lg w-80 flex items-center mb-4 space-x-2 justify-center'>
                                <CalendarCheck className='w-12 h-12 text-green-600  rounded-full mb-4' />
                                <div>
                                    <h3 className='text-lg font-semibold mb-2 text-green-600'>{startDate.toDateString()}</h3>
                                    <p className='text-sm italic'>Selected Date</p>
                                </div>
                            </div>


                            <div className=' p-4 bg-orange-100 rounded-lg w-80 flex items-center mb-4 space-x-2 justify-center'>
                                <Clock className='w-12 h-12 text-orange-600 bg-orange-200 rounded-full mb-4' />
                                <div>
                                    <h3 className='text-lg font-semibold mb-2 text-orange-600'>Available Slots</h3>
                                    <p className='text-sm italic'>12 Slots Available</p>
                                </div>
                            </div>

                        </div >
                    </div>

                </div>

            </div>



            {/* ============ SELECT TIME SLOT========================             */}
            < div className='mb-8 border-t border-gray-300 p-8 shadow-2xl rounded' >
                <h2 className='text-2xl font-semibold mb-4'>3. Select Time Slot</h2>
                <div className='flex flex-col space-y-6'>
                    <div>
                        <h3 className='text-lg font-semibold mb-2'>Morning</h3>
                        <div className='flex space-x-4'>
                            <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>9:00 AM</button>
                            <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>10:00 AM</button>
                            <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>11:00 AM</button>
                        </div>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold mb-2'>Afternoon</h3>
                        <div className='flex space-x-4'>
                            <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>1:00 PM</button>
                            <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>2:00 PM</button>
                            <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>3:00 PM</button>
                        </div>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold mb-2'>Evening</h3>
                        <div className='flex space-x-4'>
                            <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>5:00 PM</button>
                            <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>6:00 PM</button>
                            <button className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600'>7:00 PM</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* // ========================== CONFIRM DETAILS ==============================   */}

            <div className='mb-8 border-t border-gray-300 p-8 shadow-2xl rounded'>
                <h2 className='text-2xl font-semibold mb-4'>Appointment Summary</h2>
                <div className='flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md mb-4'>
                    <UserRound className='w-24 h-24 object-cover rounded-full' />
                    <div>
                        <h3 className='text-lg font-semibold'>Dr. John Doe</h3>
                        <p className='text-sm text-gray-600'>Cardiologist</p>
                        <p className='text-sm text-gray-600'>City Hospital</p>
                        <p className='text-sm text-gray-600'>10 years experience</p>
                    </div>
                </div>
                <div className='flex items-center space-x-4 mb-4'>
                    <CalendarCheck className='w-12 h-12 text-green-600  rounded-full' />
                    <div>

                        <h3 className='text-lg font-semibold mb-2 text-green-600'>Appointment Date & Time</h3>
                        <p className='text-sm italic'>September 15, 2024 at 10:00 AM</p>
                    </div>
                </div>
                <div className='flex items-center space-x-4 mb-4'>
                    <CircleDollarSign className='w-12 h-12 text-orange-600 bg-orange-200 rounded-full' />
                    <div>
                        <h3 className='text-lg font-semibold mb-2 text-orange-600'>Consultation Fee</h3>
                        <p className='text-sm italic'>$100</p>
                    </div>
                </div>
                <button className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600'>Confirm Appointment</button>

            </div>

                {/* ========================= IMPORTANT NOTICE ==============================   */}

            <div className='p-4 bg-yellow-100 rounded-lg mt-8'>
                <h3 className='text-lg font-semibold mb-2 text-yellow-800'>Important Notice</h3>
                <p className='text-sm text-yellow-700'>Please arrive 15 minutes before your scheduled appointment time to complete any necessary paperwork and ensure a smooth check-in process. Thank you for choosing our healthcare services!</p>
            </div>
        </div>
    )
}

export default BookAppointment