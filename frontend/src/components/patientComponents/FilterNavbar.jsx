import React from 'react'
import { Search } from 'lucide-react'

const FilterNavbar = () => {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white px-4 py-4 shadow-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="text-xl font-semibold text-gray-800">
        MediQueue
      </h1>

      <div className="relative w-full lg:max-w-md">
        <input
          type="text"
          placeholder="Search by doctor or hospital..."
          className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="text-sm text-gray-600 lg:text-right">
        Welcome, User
      </div>
    </div>
  )
}

export default FilterNavbar
