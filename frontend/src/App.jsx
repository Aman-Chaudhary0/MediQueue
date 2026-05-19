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
import NotFound from './pages/public/NotFound'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {

// ==========================================================================================================================================================================

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
        <Route path='/patient/dashboard' element={<ProtectedRoute requiredRoles={['patient']}><Dashboard /></ProtectedRoute>} />
        <Route path='/patient/book-appointment' element={<ProtectedRoute requiredRoles={['patient']}><BookAppointment /></ProtectedRoute>} />
        <Route path='/patient/appointment-history' element={<ProtectedRoute requiredRoles={['patient']}><AppointmentHistory /></ProtectedRoute>} />
        <Route path='/patient/live-queue' element={<ProtectedRoute requiredRoles={['patient']}><LiveQueue /></ProtectedRoute>} />
        <Route path='/patient/appointment/:appointmentId' element={<ProtectedRoute requiredRoles={['patient']}><AppointmentDetails /></ProtectedRoute>} />
        <Route path='/patient/profile' element={<ProtectedRoute requiredRoles={['patient']}><PatientProfile /></ProtectedRoute>} />



        {/* Doctor Routes */}
        <Route path='/doctor/dashboard' element={<ProtectedRoute requiredRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
        <Route path='/doctor/queue-management' element={<ProtectedRoute requiredRoles={['doctor']}><QueueManagement /></ProtectedRoute>} />
        <Route path='/doctor/profile' element={<ProtectedRoute requiredRoles={['doctor']}><DoctorProfile /></ProtectedRoute>} />


        {/* admin rouutes */}
        <Route path='/admin/dashboard' element={<ProtectedRoute requiredRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path='/admin/manage-doctors' element={<ProtectedRoute requiredRoles={['admin']}><ManageDoctors /></ProtectedRoute>} />
        <Route path='/admin/analytics' element={<ProtectedRoute requiredRoles={['admin']}><Analytics /></ProtectedRoute>} />
        {/* AdminProfile route removed (admin profile page deleted) */}

        {/* 404 Not Found - Catch all invalid routes */}
        <Route path='*' element={<NotFound />} />

      </Routes>

    </div>
  )
}

export default App
