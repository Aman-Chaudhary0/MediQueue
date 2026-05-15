import React from 'react'
import PatientNav from '../../components/patientComponents/PatientNav';
import UpcomingAppointment from '../../components/patientComponents/UpcomingAppointment';
import LiveQueueStatus from '../../components/patientComponents/LiveQueueStatus';
import QuickOptions from '../../components/patientComponents/QuickOptions';
import DashAppointmentSummary from '../../components/patientComponents/DashAppointmentSummary';
import DashRecentAppointments from '../../components/patientComponents/DashRecentAppointments';

const appointments = [
    {
        id: 1,
        doctorName: "Dr. Amit Sharma",
        hospital: "City Care Hospital",
        specialization: "Cardiologist",
        date: "14 May 2026 ",
        time: "11:15 AM",
        token: "A12",
        status: "Completed",
        photo: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: 2,
        doctorName: "Dr. Priya Verma",
        hospital: "Sunrise Clinic",
        specialization: "Dermatologist",
        date: "14 May 2026 ",
        time: "11:15 AM",
        token: "B07",
        status: "Pending",
        photo: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: 3,
        doctorName: "Dr. Raj Mehta",
        hospital: "Apollo Hospital",
        specialization: "Orthopedic",
        date: "14 May 2026 ",
        time: "11:15 AM",
        token: "C03",
        status: "Cancelled",
        photo: "https://randomuser.me/api/portraits/men/55.jpg",
    },
];



const Dashboard = () => {

// ==========================================================================================================================================================================

    return (

        // ============================= DASHBOARD ================================ 
        <div className='p-3 sm:p-6 m-1 sm:m-2'>
            <PatientNav />
            <UpcomingAppointment />

            <LiveQueueStatus />

            <QuickOptions />


            <DashAppointmentSummary />



            {/* ================= RECENT APPOINTMENTS =============================== */}


            <div className="p-3 sm:p-6 bg-white rounded-2xl shadow-md">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Appointments</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 text-xs sm:text-sm">
                                <th className="p-2 sm:p-3">Doctor</th>
                                <th className="p-2 sm:p-3 hidden sm:table-cell">Specialization</th>
                                <th className="p-2 sm:p-3 hidden md:table-cell">Date & Time</th>
                                <th className="p-2 sm:p-3">Token No.</th>
                                <th className="p-2 sm:p-3">Status</th>
                                <th className="p-2 sm:p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appointments.map((item) => (
                                <DashRecentAppointments key={item.id} item={item} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>



        </div>




    )
}

export default Dashboard
