// ============================================================
// DELIVERY PARTNERS PAGE
// Add, approve, track, and manage delivery partners
// API: GET /api/delivery/list
//      POST /api/delivery/add | update | remove | approve | assign
// ============================================================
import React, { useEffect, useState } from 'react'
import './DeliveryPartners.css'
import axios from 'axios'
import { url } from '../../assets/assets'
import { toast } from 'react-toastify'

const emptyForm = { name:'', email:'', password:'', phone:'', vehicleType:'bike', vehicleNumber:'', city:'' }

const DeliveryPartners = () => {
  const [partners, setPartners] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [image, setImage] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchPartners = async () => {
    try {
      const res = await axios.get(`${url}/api/delivery/list`)
      if (res.data.success) setPartners(res.data.data)
    } catch { toast.error('Failed to load partners') }
  }

  useEffect(() => { fetchPartners() }, [])

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openAdd = () => { setForm(emptyForm); setImage(null); setEditMode(false); setShowModal(true) }
  const openEdit = (p) => { setForm({ ...p, id: p._id }); setImage(null); setEditMode(true); setShowModal(true) }

  const onSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append('image', image)
      const endpoint = editMode ? '/api/delivery/update' : '/api/delivery/add'
      const res = await axios.post(`${url}${endpoint}`, fd)
      if (res.data.success) { toast.success(res.data.message); setShowModal(false); fetchPartners() }
      else toast.error(res.data.message)
    } catch { toast.error('Error saving partner') }
    setLoading(false)
  }

  const removePartner = async (id) => {
    if (!window.confirm('Remove this delivery partner?')) return
    const res = await axios.post(`${url}/api/delivery/remove`, { id })
    if (res.data.success) { toast.success(res.data.message); fetchPartners() }
  }

  const toggleApproval = async (id, current) => {
    const res = await axios.post(`${url}/api/delivery/approve`, { id, approve: !current })
    if (res.data.success) { toast.success(res.data.message); fetchPartners() }
  }

  const filtered = partners.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  )

  // Vehicle type icons
  const vehicleIcon = { bike: '🏍️', scooter: '🛵', cycle: '🚲' }

  return (
    <div className='delivery-page'>
      <div className='page-header'>
        <div>
          <h1>🛵 Delivery Partners</h1>
          <p>{partners.length} partners registered • {partners.filter(p => p.isAvailable && p.isApproved).length} available now</p>
        </div>
        <button className='btn btn-primary' onClick={openAdd}>➕ Add Partner</button>
      </div>

      {/* ---- Summary Stats ---- */}
      <div className='dp-stats'>
        <div className='dp-stat-chip'>✅ Approved: <b>{partners.filter(p=>p.isApproved).length}</b></div>
        <div className='dp-stat-chip'>⏳ Pending: <b>{partners.filter(p=>!p.isApproved).length}</b></div>
        <div className='dp-stat-chip'>🟢 Available: <b>{partners.filter(p=>p.isAvailable).length}</b></div>
        <div className='dp-stat-chip'>🚴 On Delivery: <b>{partners.filter(p=>!p.isAvailable).length}</b></div>
      </div>

      <div className='filter-bar'>
        <div className='search-input-wrap'>
          <span className='search-icon'>🔍</span>
          <input type='text' placeholder='Search by name, city, phone...' value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className='form-input' style={{width:'auto'}}>
          <option>All</option><option>Approved</option><option>Pending</option>
        </select>
      </div>

      <div className='card'>
        <table className='data-table'>
          <thead>
            <tr>
              <th>Partner</th><th>Phone</th><th>Vehicle</th><th>City</th>
              <th>Deliveries</th><th>Earnings</th><th>Rating</th><th>Status</th><th>Approval</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={10} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No partners found</td></tr>
            )}
            {filtered.map((p, i) => (
              <tr key={i}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div className='partner-avatar'>{p.name?.[0]?.toUpperCase() || '?'}</div>
                    <div>
                      <div className='font-bold'>{p.name}</div>
                      <div style={{fontSize:12,color:'var(--text-muted)'}}>{p.email}</div>
                    </div>
                  </div>
                </td>
                <td>{p.phone}</td>
                <td>{vehicleIcon[p.vehicleType]} {p.vehicleType} • {p.vehicleNumber}</td>
                <td>{p.city}</td>
                <td>{p.totalDeliveries}</td>
                <td>₹{p.totalEarnings?.toLocaleString('en-IN')}</td>
                <td>⭐ {p.rating}</td>
                <td><span className={`badge ${p.isAvailable ? 'badge-success' : 'badge-warning'}`}>{p.isAvailable ? 'Available' : 'On Delivery'}</span></td>
                <td>
                  <button className={`btn btn-sm ${p.isApproved ? 'btn-outline' : 'btn-success'}`} onClick={() => toggleApproval(p._id, p.isApproved)}>
                    {p.isApproved ? '✅ Approved' : '⏳ Approve'}
                  </button>
                </td>
                <td>
                  <div style={{display:'flex',gap:6}}>
                    <button className='btn btn-sm btn-outline' onClick={() => openEdit(p)}>✏️</button>
                    <button className='btn btn-sm btn-danger' onClick={() => removePartner(p._id)}>🗑️</button>
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
              <h2>{editMode ? '✏️ Edit Partner' : '➕ Add Delivery Partner'}</h2>
              <span className='modal-close' onClick={() => setShowModal(false)}>✕</span>
            </div>
            <form onSubmit={onSubmit}>
              <div className='modal-body'>
                <div className='form-grid-2'>
                  <div className='form-group'><label>Full Name *</label><input className='form-input' name='name' value={form.name} onChange={onChange} required placeholder='John Doe' /></div>
                  <div className='form-group'><label>Phone *</label><input className='form-input' name='phone' value={form.phone} onChange={onChange} required placeholder='+91 98765 43210' /></div>
                </div>
                <div className='form-grid-2'>
                  <div className='form-group'><label>Email *</label><input className='form-input' name='email' type='email' value={form.email} onChange={onChange} required /></div>
                  {!editMode && <div className='form-group'><label>Password *</label><input className='form-input' name='password' type='password' value={form.password} onChange={onChange} required /></div>}
                </div>
                <div className='form-grid-3'>
                  <div className='form-group'><label>Vehicle Type</label>
                    <select className='form-input' name='vehicleType' value={form.vehicleType} onChange={onChange}>
                      <option value='bike'>🏍️ Bike</option>
                      <option value='scooter'>🛵 Scooter</option>
                      <option value='cycle'>🚲 Cycle</option>
                    </select>
                  </div>
                  <div className='form-group'><label>Vehicle Number</label><input className='form-input' name='vehicleNumber' value={form.vehicleNumber} onChange={onChange} placeholder='KA-01-AB-1234' /></div>
                  <div className='form-group'><label>City</label><input className='form-input' name='city' value={form.city} onChange={onChange} placeholder='Bengaluru' /></div>
                </div>
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-outline' onClick={() => setShowModal(false)}>Cancel</button>
                <button type='submit' className='btn btn-primary' disabled={loading}>
                  {loading ? 'Saving...' : editMode ? 'Update Partner' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeliveryPartners
