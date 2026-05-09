import React from 'react'
import { useState } from "react";

const DoctorProfile = () => {
    const [isActive, setIsActive] = useState(true);
    return (

        <div className="bg-gray-50 min-h-screen p-6">

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Edit Doctor Profile
                </h1>
                <p className="text-gray-500 text-sm">
                    Update doctor information and availability
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">

                {/* Profile Photo */}
                <div className="flex items-center gap-6 mb-6">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="doctor"
                        className="w-24 h-24 rounded-full object-cover border"
                    />
                    <div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Upload Photo
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG up to 2MB
                        </p>
                    </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Name */}
                    <div>
                        <label className="text-sm text-gray-600">Full Name</label>
                        <input
                            type="text"
                            placeholder="Dr. John Doe"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="text-sm text-gray-600">Mobile Number</label>
                        <input
                            type="text"
                            placeholder="+91 9876543210"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Specialization */}
                    <div>
                        <label className="text-sm text-gray-600">Specialization</label>
                        <input
                            type="text"
                            placeholder="Cardiologist"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="text-sm text-gray-600">Department</label>
                        <input
                            type="text"
                            placeholder="Heart Department"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Experience */}
                    <div>
                        <label className="text-sm text-gray-600">Experience (Years)</label>
                        <input
                            type="number"
                            placeholder="10"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Fees */}
                    <div>
                        <label className="text-sm text-gray-600">Consultation Fees</label>
                        <input
                            type="number"
                            placeholder="500"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Hospital */}
                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Hospital Name</label>
                        <input
                            type="text"
                            placeholder="City Care Hospital"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between md:col-span-2 mt-4">
                        <span className="text-gray-700 font-medium">Status</span>

                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`px-5 py-2 rounded-full text-white transition ${isActive ? "bg-green-500" : "bg-red-500"
                                }`}
                        >
                            {isActive ? "Active" : "Inactive"}
                        </button>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                    <button className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100">
                        Cancel
                    </button>
                    <button className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile