import React from 'react'

const AdminAppointmentsInfo = () => {
  return (
     <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
    
                    <div className="bg-white p-5 rounded-xl shadow">
                        <p className="text-gray-500 text-sm">Total Appointments</p>
                        <h2 className="text-2xl font-bold text-blue-600">320</h2>
                    </div>
    
                    <div className="bg-white p-5 rounded-xl shadow">
                        <p className="text-gray-500 text-sm">Completed</p>
                        <h2 className="text-2xl font-bold text-green-600">250</h2>
                    </div>
    
                    <div className="bg-white p-5 rounded-xl shadow">
                        <p className="text-gray-500 text-sm">Pending</p>
                        <h2 className="text-2xl font-bold text-yellow-500">50</h2>
                    </div>
    
                    <div className="bg-white p-5 rounded-xl shadow">
                        <p className="text-gray-500 text-sm">Cancelled</p>
                        <h2 className="text-2xl font-bold text-red-500">20</h2>
                    </div>
                </div>
    
  )
}

export default AdminAppointmentsInfo