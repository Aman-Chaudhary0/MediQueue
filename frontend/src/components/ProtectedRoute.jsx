import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth()
    const token = localStorage.getItem('accessToken')

    // If loading but token exists, show children (token was just set by login)
    if (loading && token) {
        return children
    }

    // Still loading auth state and no token
    if (loading) {
        return <div></div>
    }

    // No authentication, redirect to login
    if (!isAuthenticated || !token) {
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
