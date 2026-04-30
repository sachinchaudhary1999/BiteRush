import React from 'react'
import './ProBanner.css'

const ProBanner = () => (
  <div className='pro-banner'>
    <div className='pro-banner-left'>
      <h2>⚡ Tomato <span>Pro</span></h2>
      <p>Unlimited free delivery, exclusive discounts & priority support</p>
      <div className='pro-banner-perks'>
        <div className='pro-perk'><span className='check'>✓</span> Free Delivery</div>
        <div className='pro-perk'><span className='check'>✓</span> Extra 10% OFF</div>
        <div className='pro-perk'><span className='check'>✓</span> Priority Support</div>
        <div className='pro-perk'><span className='check'>✓</span> Early Access</div>
      </div>
    </div>
    <div className='pro-banner-right'>
      <p className='pro-price'>Starting at <span>₹149</span>/mo</p>
      <button className='pro-btn'>Get Tomato Pro →</button>
    </div>
  </div>
)

export default ProBanner
