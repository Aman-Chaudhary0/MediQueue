import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth()

    // Still loading auth state and no token
    if (loading) {
        return <div></div>
    }

    // No authentication, redirect to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
    }

    // No required roles specified, allow access
    if (requiredRoles.length === 0) {
        return children
    }

    // Check if user role matches required roles
    if (requiredRoles.includes(user?.role)) {
        return children
    }

    // Unauthorized, redirect to home
    return <Navigate to="/" replace />
}

export default ProtectedRoute
