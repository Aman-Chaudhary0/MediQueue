import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'

// 3 sections - logo, list of pages, login/signup and responsive hamburger menu for mobile 
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className='w-full bg-white shadow-md'>
            <div className='h-16 flex items-center justify-between px-3 sm:px-6 lg:px-8'>
                <div className='flex items-center'>
                    <img className='h-8 sm:h-10 w-8 sm:w-10' src={assets.homepage_logo} alt="Logo" />
                    <div className='text-lg sm:text-xl font-bold text-black ml-2'>Medi<span className='text-blue-600'>Queue</span></div>
                </div>

                {/* Desktop Menu */}
                <ul className='hidden lg:flex items-center space-x-6'>
                    <li className='text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition-colors'>Home</li>
                    <li className='text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition-colors'>How it Works</li>
                    <li className='text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition-colors'>Features</li>
                    <li className='text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition-colors'>Contact Us</li>
                </ul>

                {/* Desktop Buttons */}
                <div className='hidden lg:flex space-x-3'>
                    <button className='text-blue-600 hover:text-blue-800 border border-blue-600 py-2 px-4 text-sm rounded-md transition-colors'>Login</button>
                    <button className='text-blue-600 hover:text-blue-800 border border-blue-600 py-2 px-4 text-sm rounded-md transition-colors'>Sign Up</button>
                </div>

                {/* Mobile Menu Toggle */}
                <button onClick={toggleMenu} className='lg:hidden p-2'>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className='lg:hidden bg-white border-t border-gray-200'>
                    <ul className='flex flex-col px-4 py-4 space-y-3'>
                        <li className='text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition-colors py-2'>Home</li>
                        <li className='text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition-colors py-2'>How it Works</li>
                        <li className='text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition-colors py-2'>Features</li>
                        <li className='text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition-colors py-2'>Contact Us</li>
                    </ul>
                    <div className='flex flex-col gap-2 px-4 py-3 border-t border-gray-200'>
                        <button className='w-full text-blue-600 border border-blue-600 py-2 px-4 text-sm rounded-md hover:bg-blue-50 transition-colors'>Login</button>
                        <button className='w-full text-blue-600 border border-blue-600 py-2 px-4 text-sm rounded-md hover:bg-blue-50 transition-colors'>Sign Up</button>
                    </div>
                </div>
            )}
        </div>
    )
}


export default Navbar