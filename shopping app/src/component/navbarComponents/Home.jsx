import React from 'react'
import HeroBanner from '../homeComponents/HeroBanner'
import HomeCategories from '../homeComponents/HomeCategories'
import Newcollections from '../homeComponents/Newcollections'
import AdBanner1 from '../homeComponents/AdBanner1'
import AdBanner2 from '../homeComponents/AdBanner2'
import FashionCategory from '../homeComponents/FashionCategory'
import PhoneCategory from '../homeComponents/PhoneCategory '
import LaptopCategory from '../homeComponents/LaptopCategory'
import PriceRangeShowcase from '../homeComponents/PriceRangeShowcase'
const Home = () => {
  return (
    <div> 
      <HeroBanner/>
      <HomeCategories/>
      <AdBanner1/>
      {/* Swiper needs FULL WIDTH */}
      <div className="w-full">
        <Newcollections />
      </div>
      <AdBanner2/>
      <FashionCategory/>
      <PhoneCategory/>
      <LaptopCategory/>
      <PriceRangeShowcase category="Clothing" ranges={[500, 1000, 2000]} />
      <PriceRangeShowcase category="Mobiles" ranges={[10000, 30000, 500000]} />
    </div>
  )
}

export default Home