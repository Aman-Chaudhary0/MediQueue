import React from 'react'
import { assets } from '../../assets/assets'
import AuthHeader from '../../components/common/AuthHeader'

const Login = () => {
    return (
        <div className='flex flex-col lg:flex-row min-h-screen'>

          <AuthHeader />


            {/* ================================ LOGIN FORM =========================== */}
            <div className='w-full lg:w-1/2 flex items-center justify-center px-4 py-8 sm:py-0'>
                <div className='w-full max-w-md'>
                    <div className='lg:hidden mb-6 text-center'>
                        <img src={assets.homepage_logo} alt="logo" className='w-10 h-10 mx-auto mb-2 rounded-full' />
                        <h1 className='text-xl font-semibold'>Medi<span className='text-blue-800'>Queue</span></h1>
                        <p className='text-xs italic'>Your health, our priority</p>
                    </div>
                    <div className='p-6 sm:p-8 bg-white rounded-lg shadow-lg'>
                        <h2 className='text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-center'>Welcome Back!</h2>
                        <p className='text-xs sm:text-sm italic mb-4 sm:mb-6 text-center'>Login to Continue to your account</p>


                        <form className='space-y-4 sm:space-y-6'>
                            <div>
                                <label htmlFor="email" className='block text-xs sm:text-sm font-medium text-gray-700'>Email Address</label>
                                <input placeholder="Enter Your Email" type="email" id="email" className='w-full mt-1 p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600' />
                            </div>
                            <div>
                                <label htmlFor="password" className='block text-xs sm:text-sm font-medium text-gray-700'>Password</label>
                                <input placeholder="Enter your password" type="password" id="password" className='w-full mt-1 p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600' />
                            </div>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                                <button type="button" className='text-xs sm:text-sm text-blue-600 hover:underline'>Forgot Password?</button>
                                <button type="submit" className='w-full sm:w-auto bg-blue-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors'>Login</button>
                            </div>
                        </form>
                    </div>

                    {/* ===================== OR CONTINUE WITH SOCIAL LOGIN =========================== */}

                    <div className='mt-4 sm:mt-6 p-6 sm:p-8 bg-white rounded-lg shadow-lg text-center'>
                        <p className='text-xs sm:text-sm italic mb-3 sm:mb-4'>Or continue with</p>
                        <button className='w-full bg-red-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-md hover:bg-red-700 transition-colors mb-3 sm:mb-4'>Continue with Google</button>
                        <p className='text-xs sm:text-sm italic'>Don't have an account? <button className='text-blue-600 hover:underline'>Register here</button></p>
                    </div>


                </div>
            </div>
        </div>

    )
}

export default Login