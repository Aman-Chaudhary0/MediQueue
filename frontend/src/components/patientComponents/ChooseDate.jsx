import { CalendarCheck, Clock } from 'lucide-react';
import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";


const ChooseDate = () => {

    const [startDate, setStartDate] = useState(new Date());

// ==========================================================================================================================================================================

    return (
        <div className='mb-6 sm:mb-8 rounded-2xl border-t border-gray-300 p-4 shadow-2xl sm:p-8'>
            <div className='w-full'>
                <h2 className='text-lg sm:text-2xl font-semibold mb-4'>2. Choose Date & Time</h2>
                <div className='flex flex-col gap-4 xl:flex-row xl:items-start'>

                    {/* =============================== DATE PICKER ==============================  */}
                    <div className='w-full overflow-x-auto rounded-xl bg-white p-2 shadow-sm sm:w-auto sm:p-4'>
                        <DatePicker
                            className='w-full'
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            inline
                        />
                    </div>

                    {/* =================== AVAILABLE SLOTS ============================== */}
                    <div className='grid w-full gap-3 sm:gap-4 sm:grid-cols-2 xl:max-w-sm xl:grid-cols-1'>
                        <div className='flex min-h-20 items-center gap-3 rounded-lg bg-green-100 p-3 sm:p-4'>
                            <CalendarCheck className='w-8 sm:w-12 h-8 sm:h-12 text-green-600 shrink-0' />
                            <div>
                                <h3 className='text-sm sm:text-lg font-semibold text-green-600 wrap-break-words'>{startDate.toDateString()}</h3>
                                <p className='text-xs sm:text-sm italic'>Selected Date</p>
                            </div>
                        </div>


                        <div className='flex min-h-20 items-center gap-3 rounded-lg bg-orange-100 p-3 sm:p-4'>
                            <Clock className='w-8 sm:w-12 h-8 sm:h-12 text-orange-600 shrink-0' />
                            <div>
                                <h3 className='text-sm sm:text-lg font-semibold text-orange-600'>Available Slots</h3>
                                <p className='text-xs sm:text-sm italic'>12 Slots Available</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default ChooseDate