import React, { useState } from 'react'
import './LocationModal.css'

const cities = [
  { emoji: '🏙️', name: 'Bengaluru' },
  { emoji: '🌆', name: 'Mumbai' },
  { emoji: '🏛️', name: 'Delhi NCR' },
  { emoji: '💛', name: 'Hyderabad' },
  { emoji: '🌊', name: 'Chennai' },
  { emoji: '🌸', name: 'Pune' },
  { emoji: '🏗️', name: 'Kolkata' },
  { emoji: '🎨', name: 'Ahmedabad' },
]

const LocationModal = ({ onClose, onSelect }) => {
  const [query, setQuery] = useState('')
  const filtered = cities.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className='location-modal-overlay' onClick={onClose}>
      <div className='location-modal' onClick={e => e.stopPropagation()}>
        <div className='location-modal-header'>
          <h2>Select a Location</h2>
          <span className='location-modal-close' onClick={onClose}>✕</span>
        </div>
        <div className='location-modal-search'>
          <input
            type='text'
            placeholder='Search for your location'
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className='location-detect'>
          📍 Detect my current location
        </div>
        <div className='location-cities-title'>Popular Cities</div>
        {filtered.map((city, i) => (
          <div key={i} className='location-city-item' onClick={() => { onSelect && onSelect(city.name); onClose(); }}>
            <span>{city.emoji}</span>
            <span>{city.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LocationModal
