import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = localStorage.getItem('accessToken')

    // No token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />
    }

    // No required roles specified, allow access
    if (requiredRoles.length === 0) {
        return children
    }

    // Check if user role matches required roles
    if (requiredRoles.includes(user.role)) {
        return children
    }

    // Unauthorized, redirect to home
    return <Navigate to="/" replace />
}

export default ProtectedRoute
