import React from 'react'
import { useState } from "react";
const PatientProfile = () => {
    const [gender, setGender] = useState("male");

    return (
        <div className="bg-gray-50 min-h-screen p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Edit Patient Profile
                </h1>
                <p className="text-gray-500 text-sm">
                    Update your personal information
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">

                {/* Profile Photo */}
                <div className="flex items-center gap-6 mb-6">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="patient"
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

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Name */}
                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Full Name</label>
                        <input
                            type="text"
                            placeholder="Aman Kumar"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Age */}
                    <div>
                        <label className="text-sm text-gray-600">Age</label>
                        <input
                            type="number"
                            placeholder="25"
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

                    {/* Gender */}
                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600 mb-2 block">Gender</label>
                        <div className="flex gap-4">

                            <button
                                onClick={() => setGender("male")}
                                className={`px-4 py-2 rounded-lg border ${gender === "male"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-600"
                                    }`}
                            >
                                Male
                            </button>

                            <button
                                onClick={() => setGender("female")}
                                className={`px-4 py-2 rounded-lg border ${gender === "female"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-600"
                                    }`}
                            >
                                Female
                            </button>

                            <button
                                onClick={() => setGender("other")}
                                className={`px-4 py-2 rounded-lg border ${gender === "other"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-600"
                                    }`}
                            >
                                Other
                            </button>

                        </div>
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

export default PatientProfile