import React from 'react'
import { useState } from "react";

const AdminProfile = () => {

  const [form, setForm] = useState({
    name: "Aman Kumar",
    email: "admin@mediqueue.com",
    phone: "+91 9876543210",
    hospital: "City Care Hospital",
    role: "Administrator",
  });

  const [preview, setPreview] = useState("https://via.placeholder.com/120");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Profile Settings
        </h1>
        <p className="text-gray-500 text-sm">
          Update your admin profile details
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">

        {/* Profile Section */}
        <div className="flex items-center gap-6 mb-8">
          <img
            src={preview}
            alt="admin"
            className="w-28 h-28 rounded-full object-cover border"
          />

          <div>
            <label className="block">
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                Upload Photo
              </span>
              <input
                type="file"
                onChange={handleImage}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG up to 2MB
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600">Mobile Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Hospital */}
          <div>
            <label className="text-sm text-gray-600">Hospital Name</label>
            <input
              type="text"
              name="hospital"
              value={form.hospital}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Role (Read Only) */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Role</label>
            <input
              type="text"
              value={form.role}
              disabled
              className="w-full mt-1 p-3 border rounded-lg bg-gray-100 text-gray-500"
            />
          </div>

        </div>

        {/* Password Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">
            Change Password
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="password"
              placeholder="Current Password"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="password"
              placeholder="New Password"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  )
}

export default AdminProfile