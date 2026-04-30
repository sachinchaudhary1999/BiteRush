import React from 'react'
import './RestaurantList.css'
import RestaurantCard from '../RestaurantCard/RestaurantCard'
import { restaurants } from '../../assets/restaurants'

const RestaurantList = ({ activeFilter }) => {
  const filtered = restaurants.filter(r => {
    if (!activeFilter) return true
    if (activeFilter === 'rating') return r.rating >= 4.0
    if (activeFilter === 'offers') return r.discount
    if (activeFilter === 'delivery_time') return r.deliveryTime <= 25
    if (activeFilter === 'free_delivery') return r.discount === 'Free Delivery'
    if (activeFilter === 'new') return r.promo === 'NEW'
    if (activeFilter === 'budget') return r.priceForTwo <= 350
    return true
  })

  return (
    <div className='restaurant-list'>
      <div className='restaurant-list-header'>
        <h2>🍽️ Restaurants Near You</h2>
        <span className='restaurant-list-count'>{filtered.length} restaurants</span>
      </div>
      {filtered.length === 0
        ? <div className='restaurant-list-empty'>
            <p>😕</p>
            <p>No restaurants match your filters</p>
          </div>
        : <div className='restaurant-grid'>
            {filtered.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
      }
    </div>
  )
}

export default RestaurantList
