import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import OffersCarousel from '../../components/OffersCarousel/OffersCarousel'
import WhatsOnYourMind from '../../components/WhatsOnYourMind/WhatsOnYourMind'
import QuickFilters from '../../components/QuickFilters/QuickFilters'
import RestaurantList from '../../components/RestaurantList/RestaurantList'
import CollectionSection from '../../components/CollectionSection/CollectionSection'
import ProBanner from '../../components/ProBanner/ProBanner'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'

const Home = () => {
  const [category, setCategory] = useState('All')
  const [activeFilter, setActiveFilter] = useState(null)

  return (
    <div className='home'>
      <Header />
      <OffersCarousel />
      <WhatsOnYourMind category={category} setCategory={setCategory} />
      <CollectionSection />
      <ProBanner />
      <QuickFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <RestaurantList activeFilter={activeFilter} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  )
}

export default Home
