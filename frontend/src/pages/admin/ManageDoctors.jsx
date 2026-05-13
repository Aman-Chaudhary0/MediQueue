import React, { useState } from 'react'
import {
  Search, HeartPulse, Brain, Bone, Baby, Stethoscope, Ear, Plus
} from "lucide-react";
import ManageDocNav from '../../components/adminComponents/ManageDocNav';
import ManageDocInfo from '../../components/adminComponents/ManageDocInfo';
import DoctorInfoCard from '../../components/adminComponents/DoctorInfoCard';
import AddDoctorForm from '../../components/adminComponents/AddDoctorForm';


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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddDoctorSuccess = () => {
    // Refresh doctors list after successful add
    console.log('Doctor added successfully!')
    setIsModalOpen(false)
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">

      <ManageDocNav />

      <AddDoctorForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddDoctorSuccess}
      />


      <ManageDocInfo />

      {/* ============================= Add Doctor Button + Search Box ============================================ */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
        <div className="relative flex-1 w-full">
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

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <Plus size={20} />
          Add Doctor
        </button>
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
                <DoctorInfoCard key={index} doctor={doctor} index={index} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 lg:hidden">
          {doctors.map((doctor, index) => (
            <DoctorInfoCard key={index} doctor={doctor} index={index} isTableRow={false} />
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
