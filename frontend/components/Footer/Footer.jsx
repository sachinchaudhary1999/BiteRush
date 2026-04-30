import React from 'react'
import './Footer.css'
import logo from '../../assets/biterush-logo.svg'

const Footer = () => (
  <div className='footer' id='footer'>
    <div className='footer-top'>
      <div>
        <div className='footer-brand'>
          <img src={logo} alt='BiteRush logo' className='footer-brand-img' />
        </div>
        <p className='footer-brand-desc'>Delivering happiness since 2025. Better food for more people — from 1000+ restaurants to your doorstep.</p>
        <div className='footer-social'>
          <div className='footer-social-icon'>📘</div>
          <div className='footer-social-icon'>🐦</div>
          <div className='footer-social-icon'>📸</div>
          <div className='footer-social-icon'>▶️</div>
        </div>
      </div>

      <div className='footer-col'>
        <h3>Company</h3>
        <ul>
          <li>About Us</li>
          <li>Team</li>
          <li>Blog</li>
          <li>Careers</li>
          <li>Investors</li>
          <li>Report Fraud</li>
        </ul>
      </div>

      <div className='footer-col'>
        <h3>For Restaurants</h3>
        <ul>
          <li>Partner With Us</li>
          <li>Apps For You</li>
          <li>Business Blog</li>
          <li>BiteRush for Enterprise</li>
        </ul>
        <h3 style={{marginTop: '20px'}}>Learn More</h3>
        <ul>
          <li>Privacy</li>
          <li>Security</li>
          <li>Terms</li>
          <li>Sitemap</li>
        </ul>
      </div>

      <div className='footer-col'>
        <h3>Social Links</h3>
        <ul>
          <li>LinkedIn</li>
          <li>Twitter</li>
          <li>YouTube</li>
          <li>Instagram</li>
          <li>Facebook</li>
        </ul>
        <h3 style={{marginTop: '20px'}}>Get the App</h3>
        <div className='footer-app-badges'>
          <div className='footer-app-badge'>🍎 App Store</div>
          <div className='footer-app-badge'>▶️ Play Store</div>
        </div>
      </div>
    </div>

    <hr className='footer-divider' />

    <div className='footer-bottom'>
      <div>
        <div className='footer-bottom-left'>© 2025 BiteRush Limited. All rights reserved.</div>
        <div className='footer-country'>🇮🇳 India</div>
      </div>
      <div className='footer-bottom-right'>
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
        <span>Cookie Policy</span>
        <span>Accessibility</span>
      </div>
    </div>
  </div>
)

export default Footer
