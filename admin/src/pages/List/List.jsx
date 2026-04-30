// ============================================================
// FOOD LIST PAGE
// Shows all food items in a table with image, name, category,
// price. Admin can delete items. Fetches from /api/food/list
// ============================================================
import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { url } from '../../assets/assets'
import { toast } from 'react-toastify'

const List = () => {
  const [list, setList] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  // Fetch all foods from backend
  const fetchList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`)
      if (res.data.success) setList(res.data.data)
      else toast.error('Error loading food list')
    } catch { toast.error('Cannot connect to server') }
  }

  useEffect(() => { fetchList() }, [])

  // Delete food item — also removes image from /uploads on backend
  const removeFood = async (id) => {
    if (!window.confirm('Delete this food item?')) return
    const res = await axios.post(`${url}/api/food/remove`, { id })
    if (res.data.success) { toast.success('Food item removed'); fetchList() }
    else toast.error(res.data.message)
  }

  // All unique categories from current list for the filter dropdown
  const categories = ['All', ...new Set(list.map(i => i.category))]

  // Apply search + category filter
  const filtered = list.filter(item => {
    const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || item.category === category
    return matchSearch && matchCat
  })

  return (
    <div>
      <div className='page-header'>
        <div>
          <h1>🍽️ Food Items</h1>
          <p>{list.length} items in menu</p>
        </div>
        <button className='btn btn-outline' onClick={fetchList}>🔄 Refresh</button>
      </div>

      {/* ---- Search + Category Filter ---- */}
      <div className='filter-bar'>
        <div className='search-input-wrap'>
          <span className='search-icon'>🔍</span>
          <input type='text' placeholder='Search food items...' value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {/* Category filter — dynamically built from the actual list */}
        <select className='form-input' style={{width:'auto'}} value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className='card'>
        <table className='data-table'>
          <thead>
            <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No items found</td></tr>
            )}
            {filtered.map((item, i) => (
              <tr key={i}>
                <td>
                  {/* Image served from /images/ static route on backend */}
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                </td>
                <td>
                  <div className='font-600'>{item.name}</div>
                  <div style={{fontSize:12,color:'var(--text-muted)',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.description}</div>
                </td>
                <td><span className='badge badge-info'>{item.category}</span></td>
                {/* Price stored as raw number; frontend multiplies by 80 for INR display */}
                <td className='font-bold' style={{color:'var(--red)'}}>₹{item.price * 80}</td>
                <td>
                  <button className='btn btn-sm btn-danger' onClick={() => removeFood(item._id)}>🗑️ Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default List
