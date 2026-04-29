import React, { useContext, useState } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin, setShowLocation }) => {
  const { getTotalCartAmount, token, setToken, cartItems } = useContext(StoreContext)
  const navigate = useNavigate()
  const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0)

  const logout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate('/')
  }

  return (
    <div className='navbar'>
      <div className='navbar-inner'>
        {/* Logo */}
        <Link to='/' className='navbar-logo'>
          <span className='navbar-logo-icon'>🍅</span>
          <span className='navbar-logo-text'>Tomato</span>
        </Link>

        {/* Location */}
        <div className='navbar-location' onClick={() => setShowLocation && setShowLocation(true)}>
          <span className='navbar-location-city'>Bengaluru</span>
          <span className='navbar-location-arrow'>▼</span>
        </div>

        {/* Search */}
        <div className='navbar-search'>
          <span className='navbar-search-icon'>🔍</span>
          <input
            type='text'
            placeholder='Search for restaurant, cuisine or a dish'
            onFocus={() => navigate('/search')}
            readOnly
          />
        </div>

        {/* Right buttons */}
        <div className='navbar-right'>
          <button className='navbar-right-btn' onClick={() => navigate('/offers')}>
            <span>🏷️</span>
            <span>Offers</span>
            <span className='navbar-pro-badge'>NEW</span>
          </button>

          <button className='navbar-right-btn' onClick={() => navigate('/pro')}>
            <span>⚡</span>
            <span>Tomato Pro</span>
          </button>

          <button className='navbar-right-btn navbar-cart-btn' onClick={() => navigate('/cart')}>
            <span>🛒</span>
            <span>Cart</span>
            {cartCount > 0 && <span className='navbar-cart-count'>{cartCount}</span>}
          </button>

          {!token
            ? <button className='navbar-signin-btn' onClick={() => setShowLogin(true)}>Sign In</button>
            : <div className='navbar-profile'>
                <div className='navbar-profile-trigger'>
                  <div className='navbar-profile-avatar'>U</div>
                  <span className='navbar-profile-name'>Account</span>
                  <span>▾</span>
                </div>
                <div className='navbar-dropdown'>
                  <div className='navbar-dropdown-header'>
                    <p>My Account</p>
                    <p>Manage orders & preferences</p>
                  </div>
                  <div className='navbar-dropdown-item' onClick={() => navigate('/myorders')}>
                    <span className='icon'>📦</span> My Orders
                  </div>
                  <div className='navbar-dropdown-item' onClick={() => navigate('/favourites')}>
                    <span className='icon'>❤️</span> Favourites
                  </div>
                  <div className='navbar-dropdown-item' onClick={() => navigate('/pro')}>
                    <span className='icon'>⚡</span> Tomato Pro
                  </div>
                  <div className='navbar-dropdown-item'>
                    <span className='icon'>📍</span> Saved Addresses
                  </div>
                  <div className='navbar-dropdown-item'>
                    <span className='icon'>💳</span> Payments
                  </div>
                  <hr className='navbar-dropdown-divider' />
                  <div className='navbar-dropdown-item' onClick={logout}>
                    <span className='icon'>🚪</span> Logout
                  </div>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Navbar
