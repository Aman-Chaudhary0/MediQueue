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

const App = () => {
  return (
    <div>
      {/* <Home /> */}
      {/* <Login /> */}
      {/* <Register /> */}
      {/* <BookAppointment /> */}
      {/* <Dashboard /> */}
      {/* <LiveQueue /> */}
      {/* <AppointmentHistory /> */}
      {/* <DoctorDashboard />       // some data left */}
      <QueueManagement />
    </div>
  )
}

export default App