import React from 'react'
import { assets } from '../assets/assets'

// 3 sections - logo, list of pages, login/signup and responsive hamburger menu for mobile 
const Navbar = () => {
    return (
        <div className='w-full h-16 flex items-center justify-between px-4 bg-white shadow-md'>
            <div className='flex items-center'>
                <img className='h-10 w-10' src={assets.homepage_logo} alt="Logo" />
                <div className='text-xl font-bold text-black'>Medi<span className='text-blue-600'>Queue</span></div>
            </div>


            <ul>
                <li className='inline-block mx-4 text-gray-600 hover:text-gray-800 cursor-pointer'>Home</li>
                <li className='inline-block mx-4 text-gray-600 hover:text-gray-800 cursor-pointer'>How it Works</li>
                <li className='inline-block mx-4 text-gray-600 hover:text-gray-800 cursor-pointer'>Features</li>
                <li className='inline-block mx-4 text-gray-600 hover:text-gray-800 cursor-pointer'>For Doctors</li>
                <li className='inline-block mx-4 text-gray-600 hover:text-gray-800 cursor-pointer'>Contact Us</li>
            </ul>

            <div className='flex space-x-4'>
                <button className='text-blue-600 hover:text-blue-800 border border-blue-600 py-2 px-4 rounded-md'>Login</button>
                <button className='text-blue-600 hover:text-blue-800 border border-blue-600 py-2 px-4 rounded-md'>Sign Up</button>
            </div>
        </div>
    )
}

export default Navbar