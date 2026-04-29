import React from 'react'
import './Header.css'

const Header = () => (
  <div className='header'>
    <div className='header-contents'>
      <div className='header-tag'>🚀 Free delivery on first 5 orders</div>
      <h2>Order food &amp; groceries<br />delivered to your door</h2>
      <p>Discover amazing food from 1,000+ restaurants.<br />Fast delivery, great prices — every time.</p>
      <div className='header-cta'>
        <button className='header-cta-primary'>🍽️ Order Now</button>
        <button className='header-cta-secondary'>🗺️ Explore Restaurants</button>
      </div>
    </div>
    <div className='header-stats'>
      <div className='header-stat-pill'>
        <span className='header-stat-icon'>⚡</span>
        <div className='header-stat-text'>
          <p>30 mins</p><p>Average delivery time</p>
        </div>
      </div>
      <div className='header-stat-pill'>
        <span className='header-stat-icon'>🏪</span>
        <div className='header-stat-text'>
          <p>1000+</p><p>Restaurant partners</p>
        </div>
      </div>
      <div className='header-stat-pill'>
        <span className='header-stat-icon'>⭐</span>
        <div className='header-stat-text'>
          <p>4.5 Rating</p><p>Average food rating</p>
        </div>
      </div>
    </div>
  </div>
)

export default Header
