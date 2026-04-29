import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import LocationModal from './components/LocationModal/LocationModal'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from './pages/MyOrders/MyOrders'
import Search from './pages/Search/Search'
import Restaurant from './pages/Restaurant/Restaurant'
import Verify from './pages/Verify/Verify'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showLocation, setShowLocation] = useState(false)

  return (
    <>
      <ToastContainer position='top-right' autoClose={3000} />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      {showLocation && (
        <LocationModal onClose={() => setShowLocation(false)} onSelect={() => setShowLocation(false)} />
      )}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} setShowLocation={setShowLocation} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/search' element={<Search />} />
          <Route path='/restaurant/:id' element={<Restaurant />} />
          <Route path='/verify' element={<Verify />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
