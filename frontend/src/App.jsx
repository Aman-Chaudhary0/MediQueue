import React from 'react'
import Home from './pages/public/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import BookAppointment from './pages/patient/BookAppointment'
import Dashboard from './pages/patient/Dashboard'
import LiveQueue from './pages/patient/LiveQueue'
import AppointmentHistory from './pages/patient/AppointmentHistory'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import QueueManagement from './pages/doctor/QueueManagement'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageDoctors from './pages/admin/ManageDoctors'
import ContactUs from './pages/public/ContactUs'
import DoctorProfile from './pages/doctor/DoctorProfile'
import PatientProfile from './pages/patient/PatientProfile'
import AppointmentDetails from './pages/patient/AppointmentDetails'
import Analytics from './pages/admin/Analytics'
import AdminProfile from './pages/admin/AdminProfile'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Routes>

        {/* Public Routes  */}
        <Route path="/" element={<Home />} />
        <Route path='/contact-us' element={<ContactUs />} />

        {/* Auth Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* patient Routes */}
        <Route path='/patient/dashboard' element={<Dashboard />} />
        <Route path='/patient/book-appointment' element={<BookAppointment />} />
        <Route path='/patient/appointment-history' element={<AppointmentHistory />} />
        <Route path='/patient/live-queue' element={<LiveQueue />} />
        <Route path='/patient/appointment' element={<AppointmentDetails />} />
        <Route path='/patient/profile' element={<PatientProfile />} />

        {/* Doctor Routes */}
        <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
        <Route path='/doctor/queue-management' element={<QueueManagement />} />
        <Route path='/doctor/profile' element={<DoctorProfile />} />

        {/* admin rouutes */}
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/manage-doctors' element={<ManageDoctors />} />
        <Route path='/admin/analytics' element={<Analytics />} />
        <Route path='/admin/profile' element={<AdminProfile />} />


      </Routes>

    </div>
  )
}

export default App