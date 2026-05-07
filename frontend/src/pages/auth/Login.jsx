import React from 'react'
import { assets } from '../../assets/assets'
import { Clock, Bell, Users } from 'lucide-react'

const Login = () => {
    return (


        <div className='flex'>

            <div className='w-1/2'>
            {/* =============== LOGO  =========================== */}
                <div>
                    <img src={assets.hospital_lobby} alt="hospital lobby" className='w-full h-screen object-cover rounded-2xl' />

                    <div className='absolute top-0 left-0 m-4 flex items-center'>
                        <img src={assets.homepage_logo} alt="logo" className='w-12 h-12 mr-2 rounded-full' />
                        <div>
                            <h1 className='text-2xl font-semibold'>Medi<span className='text-blue-800'>Queue</span></h1>
                            <p className='text-sm italic'>Your health, our priority</p>
                        </div>
                    </div>
                </div>

                
                {/* // =============== TEXT OVERLAY  =========================== */}
                <div className='absolute top-27 left-0 m-4'>
                    <h1 className='text-4xl font-bold mb-2'>Skip the Wait, <br /> <span className='text-blue-800'>Save Your Time.</span></h1>
                    <p className='relative text-sm italic'>Book appointments, track your queue in real-time, ans get the best healthcare experience.</p>
                </div>


            {/* ============================== FEATURES HIGHLIGHT =========================== */} 
                <div className='absolute bottom-10 left-0 m-4 flex flex-col space-y-8'>
                    <div className='flex items-center space-x-4'>
                        <Users className='w-12 h-12 text-blue-600 bg-blue-200 rounded-full ' />
                        <div>
                            <h3 className='text-lg font-semibold'>Real-Time Queue</h3>
                            <p className='text-sm italic'>Track your position in the queue and get notified when it's your turn.</p>
                        </div>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <Clock className='w-12 h-12 text-blue-600 bg-blue-200 rounded-full' />
                        <div>
                            <h3 className='text-lg  font-semibold'>Easy Booking</h3>
                            <p className='text-sm italic'>Book appointments with your preferred healthcare providers in just a few clicks.</p>
                        </div>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <Bell className='w-12 h-12 text-blue-600 bg-blue-200 rounded-full' />
                        <div>
                            <h3 className='text-lg font-semibold'>Health Records</h3>
                            <p className='text-sm italic'>Access your health records and appointment history anytime, anywhere.</p>
                        </div>
                    </div>
                </div>


            </div>


        {/* ================================ LOGIN FORM =========================== */}
            <div className='w-1/2'>
                <div className='max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg'>
                    <h2 className='text-3xl font-bold mb-4 text-center'>Welcome Back!</h2>
                    <p className='text-sm italic mb-6 text-center'>Login to Continue to your account</p>

                
                    <form className='space-y-6'>
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email Address</label>
                            <input placeholder="Enter Your Email" type="email" id="email" className='w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600' />
                        </div>
                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Password</label>
                            <input placeholder="Enter your password" type="password" id="password" className='w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600' />
                        </div>
                        <div className='flex items-center justify-between'>
                            <button type="button" className='text-sm text-blue-600 hover:underline'>Forgot Password?</button>
                            <button type="submit" className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700'>Login</button>
                        </div>
                    </form>
                </div>

                {/* ===================== OR CONTINUE WITH SOCIAL LOGIN =========================== */}

                <div className='max-w-md mx-auto mt-6 p-8 bg-white rounded-lg shadow-lg text-center'>
                    <p className='text-sm italic mb-4'>Or continue with</p>
                    <button className='w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 mb-4'>Continue with Google</button>
                    <p className='text-sm italic'>Don't have an account? <button className='text-blue-600 hover:underline'>Register here</button></p>
                </div>


            </div>
        </div>

    )
}

export default Login