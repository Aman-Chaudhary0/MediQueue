import { Users, Info, RefreshCw } from 'lucide-react'
import React from 'react'
import QueueManageNav from '../../components/doctorComponents/QueueManageNav';
import DocAppointmentsInfo from '../../components/doctorComponents/DocAppointmentsInfo';
import CurrentPatient from '../../components/doctorComponents/CurrentPatient';
import UpcomingQueue from '../../components/doctorComponents/UpcomingQueue';

const QueueManagement = () => {

   
    const patients = [
        { token: "A11", name: "Neha Singh", age: 32, gender: "Female", time: "10:45 AM", status: "Next" },
        { token: "A12", name: "Vikram Mehta", age: 45, gender: "Male", time: "11:00 AM", status: "Waiting" },
        { token: "A13", name: "Pooja Sharma", age: 29, gender: "Female", time: "11:15 AM", status: "Waiting" },
        { token: "A14", name: "Arjun Patel", age: 38, gender: "Male", time: "11:30 AM", status: "Waiting" },
        { token: "A15", name: "Sneha Reddy", age: 27, gender: "Female", time: "11:45 AM", status: "Waiting" },
        { token: "A16", name: "Karan Verma", age: 50, gender: "Male", time: "12:00 PM", status: "Waiting" },
        { token: "A17", name: "Anjali Gupta", age: 34, gender: "Female", time: "12:15 PM", status: "Waiting" },
        { token: "A18", name: "Deepak Sharma", age: 41, gender: "Male", time: "12:30 PM", status: "Waiting" },
    ];




// ==========================================================================================================================================================================

    return (
        <div className='mx-auto max-w-7xl p-4 sm:p-6'>

            {/* ================================ TITLE ================== */}
            <QueueManageNav />

            <DocAppointmentsInfo />

            <CurrentPatient />
            

            {/* ================================== upcoming queue ================================ */}
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full">

                {/* Header */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-blue-600 font-semibold">UPCOMING QUEUE</h2>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Users size={16} /> {patients.length} Patients Waiting
                        </span>

                        <button className="flex w-full items-center justify-center gap-1 rounded-lg border px-3 py-2 text-blue-600 hover:bg-blue-50 sm:w-auto sm:py-1">
                            <RefreshCw size={16} /> Refresh
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="hidden grid-cols-4 pb-2 text-sm font-medium text-gray-500 md:grid">
                    <span>Token No.</span>
                    <span>Patient Name</span>
                    <span>Time</span>
                    <span>Status</span>
                </div>

                {/* List */}
                <div className="space-y-2">
                    {patients.map((patient) => (
                        <UpcomingQueue key={patient.token} patient={patient} />
                    ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-6">
                    <button className="text-blue-600 text-sm hover:underline">
                        View All Patients â†’
                    </button>


                </div>
            </div>

            {/* ============================= tips + queue settings ============================= */}
            <div className="mt-6 flex w-full flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 sm:px-6">

                {/* Left Side - Tips */}
                <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <Info className="text-blue-600 w-5 h-5" />
                    </div>
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold text-blue-700">Tips:</span>{" "}
                        Use <span className="font-medium">â€œNext Patientâ€</span> to move to the next in queue after completing consultation.
                    </p>
                </div>

            </div>


        </div>
    )
}

export default QueueManagement
