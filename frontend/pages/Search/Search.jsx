import React, { useState } from 'react'
import './Search.css'
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard'
import { restaurants } from '../../assets/restaurants'

const trending = ['Biryani', 'Pizza', 'Burger', 'Sushi', 'Dosa', 'Chinese', 'Healthy', 'Desserts', 'North Indian', 'South Indian']

const Search = () => {
  const [query, setQuery] = useState('')

  const results = query.length > 1
    ? restaurants.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className='search-page'>
      <div className='search-bar-big'>
        <span>🔍</span>
        <input
          type='text'
          placeholder='Search for restaurant, cuisine or a dish'
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        {query && <span style={{cursor:'pointer',color:'var(--text-hint)'}} onClick={() => setQuery('')}>✕</span>}
      </div>

      {!query && (
        <div className='search-trending'>
          <h3>🔥 Trending Searches</h3>
          <div className='search-trending-tags'>
            {trending.map((t, i) => (
              <div key={i} className='search-tag' onClick={() => setQuery(t)}>
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {query.length > 1 && (
        <>
          <div className='search-results-title'>
            {results.length > 0 ? `${results.length} results for "${query}"` : ''}
          </div>
          {results.length === 0
            ? <div className='search-no-results'><p>😕</p><p>No results found for "{query}"</p></div>
            : <div className='search-results-grid'>
                {results.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
              </div>
          }
        </>
      )}
    </div>
  )
}

export default Search
