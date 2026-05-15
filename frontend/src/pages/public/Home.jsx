import React from 'react'
import Navbar from '../../components/Navbar'
import HomeHeroSection from '../../components/common/HomeHeroSection'
import HomeHowWorks from '../../components/common/HomeHowWorks'
import HomeWhyChoose from '../../components/common/HomeWhyChoose'

const Home = () => {

// ==========================================================================================================================================================================

    return (
        <div>
            <Navbar />

            <div className='bg-gray-100'>

                <HomeHeroSection />

                <HomeHowWorks />

                <HomeWhyChoose />
              

            </div>

        </div>
    )
}

export default Home