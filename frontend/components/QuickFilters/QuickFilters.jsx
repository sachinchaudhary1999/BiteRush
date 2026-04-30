import React, { useState } from 'react'
import './QuickFilters.css'

const filters = [
  { id: 'relevance', label: 'Relevance', icon: '🎯' },
  { id: 'delivery_time', label: 'Delivery Time', icon: '⏱️' },
  { id: 'rating', label: 'Rating 4.0+', icon: '⭐' },
  { id: 'offers', label: 'Offers', icon: '🏷️' },
  { id: 'veg', label: 'Pure Veg', icon: '🌿' },
  { id: 'free_delivery', label: 'Free Delivery', icon: '🚴' },
  { id: 'new', label: 'New Arrivals', icon: '🆕' },
  { id: 'budget', label: 'Budget Friendly', icon: '💰' },
]

const QuickFilters = ({ activeFilter, setActiveFilter }) => (
  <div className='quick-filters'>
    <div className='quick-filters-label'>Filter by</div>
    <div className='quick-filters-list'>
      {filters.map(f => (
        <button
          key={f.id}
          className={`qf-chip ${activeFilter === f.id ? 'active' : ''}`}
          onClick={() => setActiveFilter(prev => prev === f.id ? null : f.id)}
        >
          <span className='qf-icon'>{f.icon}</span>
          {f.label}
        </button>
      ))}
    </div>
  </div>
)

export default QuickFilters
