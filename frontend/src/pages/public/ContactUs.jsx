import React, { useState } from 'react'
import { Mail, Phone, User, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [statusMessage, setStatusMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setStatus("error");
      setStatusMessage("All fields are required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("error");
      setStatusMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/contact/send`,
        formData
      );

      if (response.data.success) {
        setStatus("success");
        setStatusMessage(response.data.message);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        });

        // Clear success message after 5 seconds
        setTimeout(() => {
          setStatus(null);
          setStatusMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setStatusMessage(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending contact message:", error);
      setStatus("error");
      setStatusMessage(error.response?.data?.message || error.message || "Failed to send message. Please try again.");
    }
  };

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

      {/* Status Messages */}
      {status === "success" && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
          <CheckCircle size={20} className="text-green-600 shrink-0" />
          <p className="text-green-700">{statusMessage}</p>
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle size={20} className="text-red-600 shrink-0" />
          <p className="text-red-700">{statusMessage}</p>
        </div>
      )}

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>

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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
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
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
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
              name="email"
              value={formData.email}
              onChange={handleInputChange}
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
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="5"
              placeholder="Write your message..."
              className="w-full py-3 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className={`w-full md:w-auto font-medium px-8 py-3 rounded-xl transition ${
            status === "loading"
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  )
}

export default ContactUs