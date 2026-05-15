import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('accessToken')

        if (storedUser && token) {
            const parsedUser = JSON.parse(storedUser)
            setUser({ ...parsedUser, accessToken: token })
            setIsAuthenticated(true)
        }
        setLoading(false)
    }, [])

    const login = (userData, token) => {
        setUser({ ...userData, accessToken: token })
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('accessToken', token)
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
    }


// ==========================================================================================================================================================================

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use auth context
export const useAuth = () => {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
