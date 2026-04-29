import React, { useState } from 'react'
import './RestaurantCard.css'
import { useNavigate } from 'react-router-dom'

const RestaurantCard = ({ restaurant }) => {
  const [fav, setFav] = useState(false)
  const navigate = useNavigate()
  const { name, cuisine, rating, deliveryTime, priceForTwo, discount, image, promo, id } = restaurant

  const ratingClass = rating >= 4 ? 'high' : rating >= 3.5 ? 'medium' : 'low'

  return (
    <div className='restaurant-card' onClick={() => navigate(`/restaurant/${id}`)}>
      <div className='restaurant-card-img-wrap'>
        <img src={image} alt={name} />
        {promo && <div className='restaurant-card-promo'>{promo}</div>}
        <div
          className='restaurant-card-fav'
          onClick={e => { e.stopPropagation(); setFav(!fav) }}
        >
          {fav ? '❤️' : '🤍'}
        </div>
        {discount && <div className='restaurant-card-discount'>🏷️ {discount}</div>}
      </div>
      <div className='restaurant-card-body'>
        <div className='restaurant-card-name'>{name}</div>
        <div className='restaurant-card-meta'>
          <div className={`restaurant-card-rating ${ratingClass}`}>
            ⭐ {rating}
          </div>
          <div className='rc-dot' />
          <span className='restaurant-card-time'>⏱ {deliveryTime} mins</span>
        </div>
        <div className='restaurant-card-cuisine'>{cuisine}</div>
      </div>
      <div className='restaurant-card-footer'>
        <span className='restaurant-card-price'>₹{priceForTwo} for two</span>
        {discount && <span className='restaurant-card-offer'>🏷️ {discount}</span>}
      </div>
    </div>
  )
}

export default RestaurantCard
