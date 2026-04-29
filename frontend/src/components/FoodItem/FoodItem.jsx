import React, { useContext } from 'react'
import './FoodItem.css'
import { StoreContext } from '../../Context/StoreContext'

const FoodItem = ({ image, name, price, desc, id }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext)
  const qty = cartItems[id] || 0
  const rating = (4.0 + Math.random() * 0.9).toFixed(1)

  return (
    <div className='food-item'>
      <div className='food-item-img-container'>
        <img className='food-item-image' src={url + "/images/" + image} alt={name} />
        <div className='food-item-veg-badge' title='Veg' />
        {qty === 0
          ? <button className='food-item-add' onClick={() => addToCart(id)}>ADD +</button>
          : <div className='food-item-counter'>
              <button onClick={() => removeFromCart(id)}>−</button>
              <span>{qty}</span>
              <button onClick={() => addToCart(id)}>+</button>
            </div>
        }
      </div>
      <div className='food-item-info'>
        <div className='food-item-name-rating'>
          <p className='food-item-name'>{name}</p>
          <span className='food-item-rating'>⭐ {rating}</span>
        </div>
        <p className='food-item-desc'>{desc}</p>
        <div className='food-item-footer'>
          <p className='food-item-price'>₹{(price * 80).toFixed(0)}</p>
          <span className='food-item-discount'>20% OFF</span>
        </div>
      </div>
    </div>
  )
}

export default FoodItem
