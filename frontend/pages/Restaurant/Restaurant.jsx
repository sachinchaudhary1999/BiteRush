import React, { useContext, useState } from 'react'
import './Restaurant.css'
import { useParams } from 'react-router-dom'
import { restaurants } from '../../assets/restaurants'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'

const categories = ['Recommended', 'Starters', 'Main Course', 'Biryani', 'Breads', 'Desserts', 'Drinks']

const Restaurant = () => {
  const { id } = useParams()
  const { food_list } = useContext(StoreContext)
  const [activeTab, setActiveTab] = useState('Recommended')

  const restaurant = restaurants.find(r => r.id === parseInt(id)) || restaurants[0]

  return (
    <div className='restaurant-page'>
      <div className='restaurant-hero'>
        <img src={restaurant.image} alt={restaurant.name} />
        <div className='restaurant-hero-info'>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.cuisine}</p>
        </div>
      </div>

      <div className='restaurant-meta-bar'>
        <div className='restaurant-meta-item'>
          <div className='val green'>⭐ {restaurant.rating}</div>
          <div className='lbl'>1K+ Ratings</div>
        </div>
        <div className='restaurant-meta-divider' />
        <div className='restaurant-meta-item'>
          <div className='val'>⏱ {restaurant.deliveryTime} mins</div>
          <div className='lbl'>Delivery Time</div>
        </div>
        <div className='restaurant-meta-divider' />
        <div className='restaurant-meta-item'>
          <div className='val'>₹{restaurant.priceForTwo}</div>
          <div className='lbl'>For Two</div>
        </div>
        <div className='restaurant-meta-divider' />
        <div className='restaurant-meta-item'>
          <div className='val'>🚴 ₹40</div>
          <div className='lbl'>Delivery Fee</div>
        </div>
      </div>

      <div className='restaurant-offers-strip'>
        {['40% OFF up to ₹80 | Use WELCOME40', 'Free delivery on orders above ₹299', '20% OFF with SBI Card', 'Buy 1 Get 1 on selected items'].map((o, i) => (
          <div key={i} className='restaurant-offer-item'>{o}</div>
        ))}
      </div>

      <div className='restaurant-layout'>
        <div className='restaurant-sidebar'>
          <h3>Menu</h3>
          {categories.map(cat => (
            <div
              key={cat}
              className={`sidebar-cat-item ${activeTab === cat ? 'active' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </div>
          ))}
        </div>

        <div>
          <div className='restaurant-menu-section'>
            <h2>🔥 {activeTab}</h2>
            <div className='restaurant-menu-grid'>
              {food_list.slice(0, 8).map((item, i) => (
                <FoodItem key={i} id={item._id} name={item.name} desc={item.description} price={item.price} image={item.image} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Restaurant
