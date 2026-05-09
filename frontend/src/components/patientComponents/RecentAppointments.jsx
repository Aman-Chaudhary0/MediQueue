import React from 'react'

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


const RecentAppointments = () => {
    return (
        <div>
            {/* ============================== APPOINTMENTS HISTORY ======================================= */}
            <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>

                <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-225 text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 text-sm">
                                <th className="p-3">Doctor</th>
                                <th className="p-3">Specialization</th>
                                <th className="p-3">Date & Time</th>
                                <th className="p-3">Token No.</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appointments.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">

                                    {/* Doctor Column */}
                                    <td className="p-3 flex items-center gap-3">
                                        <img
                                            src={item.photo}
                                            alt="doctor"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="font-medium">{item.doctorName}</p>
                                            <p className="text-sm text-gray-500">{item.hospital}</p>
                                        </div>
                                    </td>

                                    {/* Specialization */}
                                    <td className="p-3 text-md text-gray-500">{item.specialization}</td>

                                    {/* Date & Time */}
                                    <td className="p-3 text-md text-gray-800">{item.date} <br />  <span className="text-sm font-semibold text-gray-500">{item.time}</span></td>



                                    {/* Token */}
                                    <td className="p-3 ">
                                        <span className='bg-blue-100 py-3 px-5 text-blue-600 text-center rounded-2xl text-xl font-bold'>
                                            {item.token}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-2 rounded-xl text-sm font-bold
                                                    ${item.status === "Completed"
                                                    ? "bg-green-100 text-green-500 "
                                                    : item.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    {/* Action */}
                                    <td className="p-3">
                                        <button className=' text-blue-600 px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition duration-300 border-2 text-sm border-blue-600 font-semibold'>View Details</button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-4 lg:hidden">
                    {appointments.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-gray-200 p-4 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <img
                                    src={item.photo}
                                    alt="doctor"
                                    className="h-12 w-12 rounded-full"
                                />
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-900">{item.doctorName}</p>
                                    <p className="text-sm text-gray-500">{item.hospital}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Specialization</p>
                                    <p className="text-sm text-gray-800">{item.specialization}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Date & Time</p>
                                    <p className="text-sm text-gray-800">{item.date}</p>
                                    <p className="text-sm font-semibold text-gray-500">{item.time}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Token No.</p>
                                    <span className='mt-1 inline-block rounded-2xl bg-blue-100 px-4 py-2 text-lg font-bold text-blue-600'>
                                        {item.token}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</p>
                                    <span
                                        className={`mt-1 inline-block rounded-xl px-3 py-2 text-sm font-bold
                                            ${item.status === "Completed"
                                                ? "bg-green-100 text-green-500"
                                                : item.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                            </div>

                            <button className='mt-4 w-full rounded border-2 border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 transition duration-300 hover:bg-blue-600 hover:text-white sm:w-auto'>
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RecentAppointments