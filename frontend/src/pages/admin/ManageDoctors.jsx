import React from 'react'
import {
  Search, Bell, BriefcaseMedical, ShieldPlus, UserRoundCheck, UserRoundX, Phone, Mail, Trash2, HeartPulse, Brain, Bone, Baby, Stethoscope, Ear
} from "lucide-react";


const doctors = [
  {
    name: "Dr. James Smith",
    id: "DCT001",
    email: "james.smith@mediqueue.com",
    specialty: "Cardiologist",
    department: "Cardiology",
    experience: "12 Years",
    phone: "+1 555-123-4567",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=11",
    icon: <HeartPulse size={18} className="text-red-500" />,
  },
  {
    name: "Dr. Sarah Johnson",
    id: "DCT002",
    email: "sarah.johnson@mediqueue.com",
    specialty: "Dermatologist",
    department: "Dermatology",
    experience: "8 Years",
    phone: "+1 555-123-4568",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=32",
    icon: <Stethoscope size={18} className="text-purple-500" />,
  },
  {
    name: "Dr. Michael Brown",
    id: "DCT003",
    email: "michael.brown@mediqueue.com",
    specialty: "Neurologist",
    department: "Neurology",
    experience: "15 Years",
    phone: "+1 555-123-4569",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=14",
    icon: <Brain size={18} className="text-blue-500" />,
  },
  {
    name: "Dr. Emily Davis",
    id: "DCT004",
    email: "emily.davis@mediqueue.com",
    specialty: "Pediatrician",
    department: "Pediatrics",
    experience: "10 Years",
    phone: "+1 555-123-4570",
    status: "On Leave",
    image: "https://i.pravatar.cc/100?img=24",
    icon: <Baby size={18} className="text-green-500" />,
  },
  {
    name: "Dr. Robert Wilson",
    id: "DCT005",
    email: "robert.wilson@mediqueue.com",
    specialty: "Orthopedic",
    department: "Orthopedics",
    experience: "9 Years",
    phone: "+1 555-123-4571",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=18",
    icon: <Bone size={18} className="text-cyan-500" />,
  },
  {
    name: "Dr. Olivia Martinez",
    id: "DCT006",
    email: "olivia.martinez@mediqueue.com",
    specialty: "Gynecologist",
    department: "Gynecology",
    experience: "11 Years",
    phone: "+1 555-123-4572",
    status: "Active",
    image: "https://i.pravatar.cc/100?img=44",
    icon: <HeartPulse size={18} className="text-pink-500" />,
  },
  {
    name: "Dr. Daniel Thompson",
    id: "DCT007",
    email: "daniel.thompson@mediqueue.com",
    specialty: "ENT Specialist",
    department: "ENT",
    experience: "7 Years",
    phone: "+1 555-123-4573",
    status: "Inactive",
    image: "https://i.pravatar.cc/100?img=15",
    icon: <Ear size={18} className="text-teal-500" />,
  },
];

const ManageDoctors = () => {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      {/* ==================================  NAvbar ========================================= */}
      <nav className="flex w-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left Section */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Manage Doctors
        </h1>

        {/* Right Section */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">

          {/* Search Box */}
          <div className="relative w-full lg:w-auto">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search patients, doctors, appointments..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
            />
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-start">
            {/* Notification Icon */}
            <button className="relative rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100">
              <Bell size={20} className="text-gray-700" />

              {/* Notification Dot */}
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* Profile Tab */}
            <div className="flex min-w-0 items-center gap-3 rounded-xl bg-gray-50 px-3 py-2 cursor-pointer transition hover:bg-gray-100">

              <img
                src="https://i.pravatar.cc/100"
                alt="profile"
                className="h-11 w-11 rounded-full object-cover"
              />

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-gray-800">
                  Aman Sharma
                </h3>
                <p className="text-xs text-gray-500">
                  Admin
                </p>
              </div>
            </div>
          </div>

        </div>
      </nav>



      {/* ============================ Patients and doctors info ============================= */}

      <div className='w-full py-8 sm:py-10'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <div className='flex w-full items-center gap-4 rounded-2xl border border-blue-300 bg-blue-50 p-5 sm:p-6'>
            <BriefcaseMedical className='h-12 w-12 shrink-0 rounded-full bg-blue-200 p-1 text-blue-900' />
            <div className='min-w-0'>
              <p className='text-xs font-semibold text-gray-600'>Total Doctors</p>
              <p className='text-2xl font-bold'>86</p>
            </div>
          </div>

          <div className='flex w-full items-center gap-4 rounded-2xl border border-green-300 bg-green-50 p-5 sm:p-6'>
            <ShieldPlus className='h-12 w-12 shrink-0 rounded-full bg-green-200 p-1 text-green-900' />
            <div className='min-w-0'>
              <p className='text-xs font-semibold text-gray-600'>Active Doctors</p>
              <p className='text-2xl font-bold'>78</p>
            </div>
          </div>

          <div className='flex w-full items-center gap-4 rounded-2xl border border-violet-300 bg-violet-50 p-5 sm:p-6'>
            <UserRoundCheck className='h-12 w-12 shrink-0 rounded-full bg-violet-200 p-1 text-violet-900' />
            <div className='min-w-0'>
              <p className='text-xs font-semibold text-gray-600'>On Duty Today</p>
              <p className='text-2xl font-bold'>32</p>
            </div>
          </div>

          <div className='flex w-full items-center gap-4 rounded-2xl border border-orange-300 bg-orange-50 p-5 sm:p-6'>
            <UserRoundX className='h-12 w-12 shrink-0 rounded-full bg-orange-200 p-1 text-orange-900' />
            <div className='min-w-0'>
              <p className='text-xs font-semibold text-gray-600'>On leave</p>
              <p className='text-2xl font-bold'>8</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================= Search Box ============================================ */}
      <div className="relative w-full">
        {/* Search Icon */}
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        {/* Input */}
        <input
          type="text"
          placeholder="Search by name or speciality..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>


      {/* ============================ DOCTORS LIST ====================================== */}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-275">

            {/* Table Head */}
            <thead>
              <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                <th className="pb-4 font-semibold">Doctor</th>
                <th className="pb-4 font-semibold">Specialty</th>
                <th className="pb-4 font-semibold">Department</th>
                <th className="pb-4 font-semibold">Experience</th>
                <th className="pb-4 font-semibold">Contact</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold text-center">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {doctors.map((doctor, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >

                  {/* Doctor */}
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {doctor.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          ID: {doctor.id}
                        </p>

                        <p className="text-sm text-gray-500">
                          {doctor.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Specialty */}
                  <td>
                    <div className="flex items-center gap-2 text-gray-700">
                      {doctor.icon}
                      {doctor.specialty}
                    </div>
                  </td>

                  {/* Department */}
                  <td className="text-gray-700">
                    {doctor.department}
                  </td>

                  {/* Experience */}
                  <td className="text-gray-700">
                    {doctor.experience}
                  </td>

                  {/* Contact */}
                  <td>
                    <div className="space-y-2">

                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone size={15} />
                        {doctor.phone}
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Mail size={15} />
                        {doctor.email}
                      </div>

                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : doctor.status === "On Leave"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {doctor.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex items-center justify-center">
                      <button className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                        <Trash2 size={18} className="text-red-500" />
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 lg:hidden">
          {doctors.map((doctor, index) => (
            <div key={index} className="rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800">
                    {doctor.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    ID: {doctor.id}
                  </p>

                  <p className="truncate text-sm text-gray-500">
                    {doctor.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Specialty</p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                    {doctor.icon}
                    {doctor.specialty}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Department</p>
                  <p className="mt-1 text-sm text-gray-700">{doctor.department}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Experience</p>
                  <p className="mt-1 text-sm text-gray-700">{doctor.experience}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${doctor.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : doctor.status === "On Leave"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {doctor.status}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Contact</p>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={15} />
                      {doctor.phone}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={15} />
                      {doctor.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                  <Trash2 size={18} className="text-red-500" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-gray-500">
            Showing 1 to 7 of 86 doctors
          </p>

          {/* Pagination */}
          <div className="flex flex-wrap items-center gap-2">

            <button className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500">
              ←
            </button>

            <button className="w-9 h-9 rounded-lg bg-blue-600 text-white">
              1
            </button>

            <button className="w-9 h-9 rounded-lg border border-gray-200">
              2
            </button>

            <button className="w-9 h-9 rounded-lg border border-gray-200">
              3
            </button>

            <span className="px-2 text-gray-400">...</span>

            <button className="w-9 h-9 rounded-lg border border-gray-200">
              12
            </button>

            <button className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500">
              →
            </button>

          </div>

        </div>
      </div>

    </div>
  )
}

export default ManageDoctors
