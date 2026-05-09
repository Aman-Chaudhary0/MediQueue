import React from 'react'
import { Mail, Phone, User, MessageSquare } from "lucide-react";

const ContactUs = () => {
    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

            {/* Heading */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    Contact Us
                </h2>

                <p className="text-gray-500 mt-2">
                    Have questions or need help? Send us a message.
                </p>
            </div>

            {/* Form */}
            <form className="space-y-6">

                {/* Name + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Full Name
                        </label>

                        <div className="relative mt-2">
                            <User
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full py-3 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Phone Number
                        </label>

                        <div className="relative mt-2">
                            <Phone
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                className="w-full py-3 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Email Address
                    </label>

                    <div className="relative mt-2">
                        <Mail
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full py-3 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Message
                    </label>

                    <div className="relative mt-2">
                        <MessageSquare
                            size={18}
                            className="absolute left-4 top-5 text-gray-400"
                        />

                        <textarea
                            rows="5"
                            placeholder="Write your message..."
                            className="w-full py-3 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl transition"
                >
                    Send Message
                </button>
            </form>
        </div>
    )
}

export default ContactUs