import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext)
  const filtered = food_list.filter(item => category === 'All' || category === item.category)

  return (
    <div className='food-display' id='food-display'>
      <hr className='food-display-divider' />
      <div className='food-display-header'>
        <h2>🍱 Top Dishes Near You</h2>
        <div className='food-display-sort'>
          <span>Sort by:</span>
          <select>
            <option>Relevance</option>
            <option>Rating</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>
      {filtered.length === 0
        ? <div className='food-display-empty'>No dishes found in this category.</div>
        : <div className='food-display-grid'>
            {filtered.map((item, i) => (
              <FoodItem
                key={i}
                id={item._id}
                name={item.name}
                desc={item.description}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
      }
    </div>
  )
}

export default FoodDisplay
