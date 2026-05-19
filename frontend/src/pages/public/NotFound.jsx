import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'
import { assets } from '../../assets/assets'

const NotFound = () => {
    const navigate = useNavigate()
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <div className='min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 relative overflow-hidden'>
            {/* Background decorative elements */}
            <div className='absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
            <div className='absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
            <div className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>

            {/* Main content */}
            <div className='relative z-10 text-center max-w-2xl mx-auto'>
                {/* Logo */}
                <div className={`transition-all duration-1000 transform ${isLoaded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    <img src={assets.homepage_logo} alt='logo' className='w-20 h-20 mx-auto mb-6 animate-bounce' />
                </div>

                {/* 404 Text with animation */}
                <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className='relative inline-block mb-6'>
                        <h1 className='text-9xl sm:text-[140px] font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse'>
                            404
                        </h1>
                        <div className='absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-2xl -z-10'></div>
                    </div>
                </div>

                {/* Alert icon */}
                <div className={`transition-all duration-1000 transform ${isLoaded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} mb-6`}>
                    <div className='inline-block p-4 bg-red-100 rounded-full'>
                        <AlertCircle className='text-red-600 animate-spin' size={32} style={{ animationDuration: '3s' }} />
                    </div>
                </div>

                {/* Heading */}
                <h2 className={`text-3xl sm:text-4xl font-bold text-gray-800 mb-3 transition-all duration-1000 delay-200 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    Page Not Found
                </h2>

                {/* Description */}
                <p className={`text-lg text-gray-600 mb-8 transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </p>

                {/* Additional info */}
                <div className={`mb-8 p-4 sm:p-6 bg-white rounded-lg shadow-lg border-l-4 border-blue-600 transition-all duration-1000 delay-400 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <p className='text-gray-600'>
                        <span className='font-semibold text-gray-800'>Error Code:</span> Page not found (404)
                    </p>
                    <p className='text-sm text-gray-500 mt-2'>
                        If you think this is a mistake, please contact our support team or return to the home page.
                    </p>
                </div>

                {/* Action buttons */}
                <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <button
                        onClick={() => navigate('/')}
                        className='flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-105 active:scale-95 shadow-lg'
                    >
                        <Home size={20} />
                        Back to Home
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className='flex items-center justify-center gap-2 px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all hover:scale-105 active:scale-95'
                    >
                        Go Back
                    </button>
                </div>

                {/* Floating elements */}
                <div className='absolute top-20 left-10 animate-float'>
                    <div className='text-4xl'>🚑</div>
                </div>
                <div className='absolute bottom-20 right-10 animate-float' style={{ animationDelay: '1s' }}>
                    <div className='text-4xl'>💊</div>
                </div>
                <div className='absolute top-1/3 right-20 animate-float' style={{ animationDelay: '2s' }}>
                    <div className='text-4xl'>🩺</div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                .animate-blob {
                    animation: blob 7s infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}

export default NotFound
