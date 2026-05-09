import { Clock, AlertCircle,Bell, FileText } from 'lucide-react';
import React from 'react'


const ImportantInstructions = () => {

    // array for general instructions 
    const instructions = [
        {
            icon: <Clock className="text-blue-600 w-6 h-6" />,
            title: "Be On Time",
            subtitle: "Arrive at least 10 minutes before your slot",
        },
        {
            icon: <Bell className="text-green-600 w-6 h-6" />,
            title: "Stay Alert",
            subtitle: "Keep checking your queue status regularly",
        },
        {
            icon: <FileText className="text-purple-600 w-6 h-6" />,
            title: "Carry Documents",
            subtitle: "Bring all required medical records",
        },
        {
            icon: <AlertCircle className="text-red-500 w-6 h-6" />,
            title: "Follow Guidelines",
            subtitle: "Wear mask and follow clinic rules",
        },
    ];


    return (
        <div className="w-full max-w-5xl mx-auto">

            {/* 🔹 Heading */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Important Instructions
            </h2>

            {/* 🔹 4 Boxes Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {instructions.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-start gap-2 hover:shadow-lg transition"
                    >
                        <div className="bg-gray-100 p-2 rounded-lg">
                            {item.icon}
                        </div>

                        <h3 className="text-md font-semibold text-gray-800">
                            {item.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {item.subtitle}
                        </p>
                    </div>
                ))}
            </div>
        </div>


    )
}

export default ImportantInstructions