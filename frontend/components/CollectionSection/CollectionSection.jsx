import React from 'react'
import './CollectionSection.css'

const collections = [
  { title: "Healthy Food", count: "246 places", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop" },
  { title: "Date Night", count: "182 places", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop" },
  { title: "Quick Bites", count: "318 places", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=200&fit=crop" },
  { title: "Late Night", count: "94 places", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop" },
]

const CollectionSection = () => (
  <div className='collections'>
    <h2>🗂️ Collections</h2>
    <div className='collections-grid'>
      {collections.map((c, i) => (
        <div key={i} className='collection-card'>
          <img src={c.img} alt={c.title} />
          <div className='collection-card-overlay'>
            <h3>{c.title}</h3>
            <p>{c.count}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default CollectionSection
