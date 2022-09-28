import React from 'react'
import Navbar from '../src/sections/general/Navbar'
import WelcomeBanner from '../src/sections/general/WelcomeBanner'
import FeaturedEmployer from '../src/components/general/Employers.tsx/FeaturedEmployers'
import LatestJobs from '../src/components/general/Jobs.tsx/LatestJobs'


export default function Scholar() {
  return (
    <div>
        <Navbar />
        <WelcomeBanner />
        <FeaturedEmployer />
        <LatestJobs />
    </div>
    
  )
}
