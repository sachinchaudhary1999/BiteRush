import React from 'react'
import './OffersCarousel.css'

const offers = [
  { cls: 'offer-card-1', badge: 'Limited Time', title: '40% OFF up to ₹120', desc: 'On your first 2 orders', code: 'WELCOME40', emoji: '🎉' },
  { cls: 'offer-card-2', badge: 'BiteRush Pro', title: 'Free Delivery', desc: 'On all orders with Pro', code: 'GOPRO', emoji: '⚡' },
  { cls: 'offer-card-3', badge: 'Weekend Special', title: '₹100 OFF', desc: 'On orders above ₹399', code: 'WEEKEND100', emoji: '🍕' },
  { cls: 'offer-card-4', badge: 'New Users', title: '60% OFF', desc: 'Use code on first order', code: 'NEW60', emoji: '🎊' },
  { cls: 'offer-card-5', badge: 'Happy Hours', title: 'Buy 1 Get 1', desc: 'On selected restaurants', code: 'BOGO', emoji: '🤝' },
]

const OffersCarousel = () => (
  <div className='offers-carousel'>
    <div className='offers-carousel-header'>
      <h2>🏷️ Best Offers For You</h2>
      <span className='offers-carousel-see-all'>See All →</span>
    </div>
    <div className='offers-list'>
      {offers.map((o, i) => (
        <div key={i} className={`offer-card ${o.cls}`}>
          <div className='offer-badge'>{o.badge}</div>
          <h3>{o.title}</h3>
          <p>{o.desc}</p>
          <div className='offer-code'>{o.code}</div>
          <div className='offer-emoji'>{o.emoji}</div>
        </div>
      ))}
    </div>
  </div>
)

export default OffersCarousel
