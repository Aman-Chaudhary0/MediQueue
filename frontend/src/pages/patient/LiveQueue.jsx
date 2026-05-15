import React, { useState } from 'react'
import LiveQueueCard from '../../components/patientComponents/LiveQueueCard';
import QueueStatusCard from '../../components/patientComponents/QueueStatusCard';
import QueueSummary from '../../components/patientComponents/QueueSummary';
import LiveQueueNotification from '../../components/patientComponents/LiveQueueNotification';
import ImportantInstructions from '../../components/patientComponents/ImportantInstructions';





const LiveQueue = () => {

    // Fake data for queue Status
    const data = [
        { token: "A01", name: "Ravi Kumar", status: "Completed" },
        { token: "A02", name: "Anjali Singh", status: "In Progress" },
        { token: "A03", name: "Mohit Sharma", status: "Waiting" },
        { token: "A04", name: "Neha Verma", status: "Waiting" },
    ];


    // style of queue status
    const getStatusStyle = (status) => {
        if (status === "Completed")
            return "bg-green-100 text-green-700";
        if (status === "In Progress")
            return "bg-blue-100 text-blue-700";
        return "bg-yellow-100 text-yellow-700";
    };





    const [doctor, setDoctor] = useState("");


// ==========================================================================================================================================================================

    return (
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>

                {/* ==============NAV TEXT ====================== */}
                <div className="flex flex-col">

                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                        Live Queue
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500">
                        See your position in the queue and stay updated instantly
                    </p>
                </div>


                {/* ==================================== SELECT A DOCTOR =========================================== */}
                <div className="w-full lg:max-w-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Doctor
                    </label>

                    <select
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Choose a doctor --</option>
                        <option value="dr-sharma">Dr. Sharma</option>
                        <option value="dr-priya">Dr. Priya</option>
                        <option value="dr-khan">Dr. Khan</option>
                    </select>

                    {/* Optional: show selected */}
                    {doctor && (
                        <p className="mt-2 text-sm text-gray-600">
                            Selected: <span className="font-medium">{doctor}</span>
                        </p>
                    )}
                </div>
            </div>


            {/* =========================== SECTION 1 ========================================== */}
            <section className='grid grid-cols-1 lg:grid-cols-3 gap-6 my-8'>

                <LiveQueueCard />

                {/* ================================================= QUEUE STATUS TABLE ============================================== */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-5">
                    <div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4'>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Queue Status
                        </h2>
                        <button className='w-fit bg-green-100 rounded px-4 py-1 text-green-600 font-bold text-sm'><span className='text-lg'>â€¢</span> Live</button>
                    </div>

                    <div className="hidden sm:grid grid-cols-3 font-medium text-gray-600 border-b pb-2">
                        <div className='text-sm font-bold'>Token No.</div>
                        <div className='text-sm font-bold'>Patient Name</div>
                        <div className='text-sm font-bold'>Status</div>
                    </div>


                    {/* ======================================== INFO OF EACH APPOINTMENT ============================================ */}
                    {data.map((item, index) => (
                        <QueueStatusCard
                            key={item.token}
                            item={item}
                            index={index}
                            getStatusStyle={getStatusStyle}
                        />
                    ))}
                </div>
            </section>

            <QueueSummary />

            <LiveQueueNotification />



            <ImportantInstructions />

        </div>
    )
}

export default LiveQueue
