// ============================================================
// RESTAURANTS PAGE
// Full CRUD: Add, Edit, Approve, Toggle, Delete restaurants
// API: GET /api/restaurant/list
//      POST /api/restaurant/add | update | remove | approve | toggle
// ============================================================
import React, { useEffect, useState } from 'react'
import './Restaurants.css'
import axios from 'axios'
import { url } from '../../assets/assets'
import { toast } from 'react-toastify'

// Empty form state — used for both Add and Edit
const emptyForm = {
  name: '', description: '', cuisine: '', address: '', city: '',
  phone: '', email: '', deliveryTime: 30, priceForTwo: 400,
  deliveryFee: 40, minOrder: 100, openingTime: '09:00', closingTime: '23:00',
  isActive: true
}

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)   // true = edit, false = add
  const [form, setForm] = useState(emptyForm)
  const [image, setImage] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  // ---- Fetch all restaurants from backend ----
  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${url}/api/restaurant/list`)
      if (res.data.success) setRestaurants(res.data.data)
    } catch { toast.error('Failed to load restaurants') }
  }

  useEffect(() => { fetchRestaurants() }, [])

  // ---- Handle form field changes ----
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // ---- Open modal for adding new restaurant ----
  const openAdd = () => {
    setForm(emptyForm)
    setImage(null)
    setEditMode(false)
    setShowModal(true)
  }

  // ---- Open modal pre-filled for editing ----
  const openEdit = (r) => {
    setForm({ ...r, id: r._id })
    setImage(null)
    setEditMode(true)
    setShowModal(true)
  }

  // ---- Submit: Add or Update restaurant ----
  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      // Append all form fields to FormData for multipart upload
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append('image', image)

      const endpoint = editMode ? '/api/restaurant/update' : '/api/restaurant/add'
      const res = await axios.post(`${url}${endpoint}`, fd)

      if (res.data.success) {
        toast.success(res.data.message)
        setShowModal(false)
        fetchRestaurants()
      } else {
        toast.error(res.data.message)
      }
    } catch { toast.error('Error saving restaurant') }
    setLoading(false)
  }

  // ---- Delete restaurant ----
  const removeRestaurant = async (id) => {
    if (!window.confirm('Delete this restaurant?')) return
    const res = await axios.post(`${url}/api/restaurant/remove`, { id })
    if (res.data.success) { toast.success(res.data.message); fetchRestaurants() }
    else toast.error(res.data.message)
  }

  // ---- Approve or reject restaurant ----
  const toggleApproval = async (id, currentApproval) => {
    const res = await axios.post(`${url}/api/restaurant/approve`, { id, approve: !currentApproval })
    if (res.data.success) { toast.success(res.data.message); fetchRestaurants() }
  }

  // ---- Enable / disable restaurant ----
  const toggleStatus = async (id) => {
    const res = await axios.post(`${url}/api/restaurant/toggle`, { id })
    if (res.data.success) { toast.success(res.data.message); fetchRestaurants() }
  }

  // ---- Filter by search query ----
  const filtered = restaurants.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.city?.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='restaurants-page'>
      {/* ---- Page Header ---- */}
      <div className='page-header'>
        <div>
          <h1>🏪 Restaurants</h1>
          <p>{restaurants.length} restaurants on platform</p>
        </div>
        <button className='btn btn-primary' onClick={openAdd}>➕ Add Restaurant</button>
      </div>

      {/* ---- Search/Filter Bar ---- */}
      <div className='filter-bar'>
        <div className='search-input-wrap'>
          <span className='search-icon'>🔍</span>
          <input
            type='text' placeholder='Search by name, city, cuisine...'
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className='form-input' style={{width:'auto'}}>
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Pending Approval</option>
        </select>
      </div>

      {/* ---- Restaurants Table ---- */}
      <div className='card'>
        <table className='data-table'>
          <thead>
            <tr>
              <th>Image</th><th>Name</th><th>Cuisine</th><th>City</th>
              <th>Rating</th><th>Delivery</th><th>Status</th><th>Approved</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{textAlign:'center', padding:'40px', color:'var(--text-muted)'}}>No restaurants found</td></tr>
            )}
            {filtered.map((r, i) => (
              <tr key={i}>
                <td>
                  {r.image
                    ? <img src={`${url}/images/${r.image}`} alt={r.name} />
                    : <div className='img-placeholder'>🏪</div>
                  }
                </td>
                <td>
                  <div className='font-bold'>{r.name}</div>
                  <div style={{fontSize:12, color:'var(--text-muted)'}}>{r.email}</div>
                </td>
                <td>{r.cuisine}</td>
                <td>{r.city}</td>
                <td>⭐ {r.rating}</td>
                <td>{r.deliveryTime} min • ₹{r.deliveryFee}</td>
                <td>
                  {/* Toggle active/inactive */}
                  <div className='toggle-wrap' onClick={() => toggleStatus(r._id)}>
                    <div className={`toggle ${r.isActive ? 'on' : 'off'}`}>
                      <div className='toggle-knob'></div>
                    </div>
                    <span className={`badge ${r.isActive ? 'badge-success' : 'badge-grey'}`}>
                      {r.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td>
                  {/* Approve / Reject */}
                  <button
                    className={`btn btn-sm ${r.isApproved ? 'btn-outline' : 'btn-success'}`}
                    onClick={() => toggleApproval(r._id, r.isApproved)}
                  >
                    {r.isApproved ? '✅ Approved' : '⏳ Approve'}
                  </button>
                </td>
                <td>
                  <div style={{display:'flex', gap:6}}>
                    <button className='btn btn-sm btn-outline' onClick={() => openEdit(r)}>✏️</button>
                    <button className='btn btn-sm btn-danger' onClick={() => removeRestaurant(r._id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- Add/Edit Modal ---- */}
      {showModal && (
        <div className='modal-overlay' onClick={() => setShowModal(false)}>
          <div className='modal' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>{editMode ? '✏️ Edit Restaurant' : '➕ Add Restaurant'}</h2>
              <span className='modal-close' onClick={() => setShowModal(false)}>✕</span>
            </div>
            <form onSubmit={onSubmit}>
              <div className='modal-body'>
                {/* Image upload */}
                <div className='form-group'>
                  <label>Restaurant Image</label>
                  <label className='img-upload-label' htmlFor='r-image'>
                    {image
                      ? <img src={URL.createObjectURL(image)} alt='preview' />
                      : form.image
                      ? <img src={`${url}/images/${form.image}`} alt='current' />
                      : <><span style={{fontSize:32}}>🏪</span><span>Click to upload</span></>
                    }
                  </label>
                  <input type='file' id='r-image' hidden onChange={e => setImage(e.target.files[0])} />
                </div>

                {/* Basic info */}
                <div className='form-grid-2'>
                  <div className='form-group'><label>Restaurant Name *</label><input className='form-input' name='name' value={form.name} onChange={onChange} required placeholder='e.g. Biryani Palace' /></div>
                  <div className='form-group'><label>Cuisine Type *</label><input className='form-input' name='cuisine' value={form.cuisine} onChange={onChange} required placeholder='e.g. North Indian, Chinese' /></div>
                </div>

                <div className='form-group'><label>Description</label><textarea className='form-input' name='description' value={form.description} onChange={onChange} rows={3} placeholder='Brief description of the restaurant' /></div>

                {/* Contact */}
                <div className='form-grid-2'>
                  <div className='form-group'><label>Phone</label><input className='form-input' name='phone' value={form.phone} onChange={onChange} placeholder='+91 98765 43210' /></div>
                  <div className='form-group'><label>Email</label><input className='form-input' name='email' type='email' value={form.email} onChange={onChange} placeholder='owner@restaurant.com' /></div>
                </div>

                {/* Location */}
                <div className='form-grid-2'>
                  <div className='form-group'><label>City *</label><input className='form-input' name='city' value={form.city} onChange={onChange} required placeholder='Bengaluru' /></div>
                  <div className='form-group'><label>Address *</label><input className='form-input' name='address' value={form.address} onChange={onChange} required placeholder='123, MG Road' /></div>
                </div>

                {/* Delivery settings */}
                <div className='form-grid-3'>
                  <div className='form-group'><label>Delivery Time (mins)</label><input className='form-input' name='deliveryTime' type='number' value={form.deliveryTime} onChange={onChange} /></div>
                  <div className='form-group'><label>Delivery Fee (₹)</label><input className='form-input' name='deliveryFee' type='number' value={form.deliveryFee} onChange={onChange} /></div>
                  <div className='form-group'><label>Price For Two (₹)</label><input className='form-input' name='priceForTwo' type='number' value={form.priceForTwo} onChange={onChange} /></div>
                </div>

                {/* Hours */}
                <div className='form-grid-2'>
                  <div className='form-group'><label>Opening Time</label><input className='form-input' name='openingTime' type='time' value={form.openingTime} onChange={onChange} /></div>
                  <div className='form-group'><label>Closing Time</label><input className='form-input' name='closingTime' type='time' value={form.closingTime} onChange={onChange} /></div>
                </div>
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-outline' onClick={() => setShowModal(false)}>Cancel</button>
                <button type='submit' className='btn btn-primary' disabled={loading}>
                  {loading ? 'Saving...' : editMode ? 'Update Restaurant' : 'Add Restaurant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Restaurants
