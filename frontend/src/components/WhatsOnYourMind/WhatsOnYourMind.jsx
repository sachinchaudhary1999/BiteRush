import React, { useContext } from 'react'
import './WhatsOnYourMind.css'
import { StoreContext } from '../../Context/StoreContext'

const WhatsOnYourMind = ({ category, setCategory }) => {
  const { menu_list } = useContext(StoreContext)

  return (
    <div className='wym'>
      <h2>What&apos;s on your mind?</h2>
      <div className='wym-list'>
        {menu_list.map((item, i) => (
          <div
            key={i}
            className={`wym-item ${category === item.menu_name ? 'active' : ''}`}
            onClick={() => setCategory(prev => prev === item.menu_name ? 'All' : item.menu_name)}
          >
            <div className='wym-img-wrap'>
              <img src={item.menu_image} alt={item.menu_name} />
            </div>
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WhatsOnYourMind
