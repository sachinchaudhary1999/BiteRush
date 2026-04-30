import React from 'react'
import './AppDownload.css'

const AppDownload = () => (
  <div className='app-download' id='app-download'>
    <div className='app-download-left'>
      <h2>Get the Tomato App 🍅</h2>
      <p>Order food, track deliveries in real-time, explore exclusive offers — all in your pocket. Available on iOS & Android.</p>
      <div className='app-download-buttons'>
        <button className='app-download-btn'>
          <span className='btn-icon'>🍎</span>
          <div className='app-download-btn-text'>
            <small>Download on the</small>
            <strong>App Store</strong>
          </div>
        </button>
        <button className='app-download-btn'>
          <span className='btn-icon'>▶️</span>
          <div className='app-download-btn-text'>
            <small>Get it on</small>
            <strong>Google Play</strong>
          </div>
        </button>
      </div>
      <div className='app-download-stats'>
        <div className='app-stat'><div className='app-stat-num'>10M+</div><div className='app-stat-label'>Downloads</div></div>
        <div className='app-stat'><div className='app-stat-num'>4.7⭐</div><div className='app-stat-label'>App Rating</div></div>
        <div className='app-stat'><div className='app-stat-num'>1000+</div><div className='app-stat-label'>Cities</div></div>
      </div>
    </div>
    <div className='app-download-right'>🍅</div>
  </div>
)

export default AppDownload
