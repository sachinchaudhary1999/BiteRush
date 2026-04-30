// ============================================================
// COUPONS PAGE
// Create/Edit/Delete discount coupons
// Types: percentage (e.g. 20% OFF) or flat (e.g. ₹100 OFF)
// API: GET /api/coupon/list
//      POST /api/coupon/add | update | remove
// ============================================================
import React, { useEffect, useState } from 'react'
import './Coupons.css'
import axios from 'axios'
import { url } from '../../assets/assets'
import { toast } from 'react-toastify'

// Default form for a new coupon
const emptyForm = {
  code: '', description: '', discountType: 'percentage',
  discountValue: '', minOrderAmount: 0, maxDiscount: 500,
  usageLimit: 100, expiryDate: '', isActive: true
}

const Coupons = () => {
  const [coupons, setCoupons] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${url}/api/coupon/list`)
      if (res.data.success) setCoupons(res.data.data)
    } catch { toast.error('Failed to load coupons') }
  }

  useEffect(() => { fetchCoupons() }, [])

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openAdd = () => { setForm(emptyForm); setEditMode(false); setShowModal(true) }
  const openEdit = (c) => { setForm({ ...c, id: c._id, expiryDate: c.expiryDate?.slice(0,10) }); setEditMode(true); setShowModal(true) }

  const onSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const endpoint = editMode ? '/api/coupon/update' : '/api/coupon/add'
      const res = await axios.post(`${url}${endpoint}`, { ...form, code: form.code.toUpperCase() })
      if (res.data.success) { toast.success(res.data.message); setShowModal(false); fetchCoupons() }
      else toast.error(res.data.message)
    } catch { toast.error('Error saving coupon') }
    setLoading(false)
  }

  const removeCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return
    const res = await axios.post(`${url}/api/coupon/remove`, { id })
    if (res.data.success) { toast.success(res.data.message); fetchCoupons() }
  }

  const isExpired = (date) => new Date(date) < new Date()

  return (
    <div>
      <div className='page-header'>
        <div>
          <h1>🏷️ Coupons & Offers</h1>
          <p>{coupons.filter(c => c.isActive).length} active coupons</p>
        </div>
        <button className='btn btn-primary' onClick={openAdd}>➕ Create Coupon</button>
      </div>

      {/* ---- Coupons Grid ---- */}
      <div className='coupons-grid'>
        {coupons.length === 0 && (
          <div style={{gridColumn:'1/-1',textAlign:'center',padding:'60px',color:'var(--text-muted)'}}>
            <div style={{fontSize:48,marginBottom:12}}>🏷️</div>
            <p>No coupons yet. Create your first one!</p>
          </div>
        )}
        {coupons.map((c, i) => (
          <div key={i} className={`coupon-card ${!c.isActive || isExpired(c.expiryDate) ? 'expired' : ''}`}>
            {/* Coupon type badge */}
            <div className='coupon-card-header'>
              <span className={`badge ${c.discountType === 'percentage' ? 'badge-info' : 'badge-success'}`}>
                {c.discountType === 'percentage' ? '% OFF' : '₹ FLAT'}
              </span>
              <span className={`badge ${isExpired(c.expiryDate) ? 'badge-danger' : c.isActive ? 'badge-success' : 'badge-grey'}`}>
                {isExpired(c.expiryDate) ? 'Expired' : c.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Coupon code — dashed border style like real coupons */}
            <div className='coupon-code-box'>
              <span className='coupon-code'>{c.code}</span>
            </div>

            <div className='coupon-value'>
              {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
            </div>
            <div className='coupon-desc'>{c.description}</div>

            {/* Coupon details */}
            <div className='coupon-details'>
              <div>Min order: ₹{c.minOrderAmount}</div>
              <div>Max discount: ₹{c.maxDiscount}</div>
              <div>Used: {c.usedCount}/{c.usageLimit}</div>
              <div>Expires: {new Date(c.expiryDate).toLocaleDateString('en-IN')}</div>
            </div>

            {/* Progress bar — shows usage */}
            <div className='coupon-progress-wrap'>
              <div className='coupon-progress' style={{width: `${Math.min((c.usedCount/c.usageLimit)*100,100)}%`}}></div>
            </div>

            <div className='coupon-actions'>
              <button className='btn btn-sm btn-outline' onClick={() => openEdit(c)}>✏️ Edit</button>
              <button className='btn btn-sm btn-danger' onClick={() => removeCoupon(c._id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Create/Edit Modal ---- */}
      {showModal && (
        <div className='modal-overlay' onClick={() => setShowModal(false)}>
          <div className='modal' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>{editMode ? '✏️ Edit Coupon' : '➕ Create Coupon'}</h2>
              <span className='modal-close' onClick={() => setShowModal(false)}>✕</span>
            </div>
            <form onSubmit={onSubmit}>
              <div className='modal-body'>
                <div className='form-grid-2'>
                  {/* Auto-uppercase the code */}
                  <div className='form-group'>
                    <label>Coupon Code *</label>
                    <input className='form-input' name='code' value={form.code.toUpperCase()} onChange={onChange} required placeholder='e.g. WELCOME40' style={{textTransform:'uppercase',letterSpacing:2,fontWeight:700}} />
                  </div>
                  <div className='form-group'>
                    <label>Discount Type *</label>
                    <select className='form-input' name='discountType' value={form.discountType} onChange={onChange}>
                      <option value='percentage'>Percentage (% OFF)</option>
                      <option value='flat'>Flat Amount (₹ OFF)</option>
                    </select>
                  </div>
                </div>

                <div className='form-group'>
                  <label>Description</label>
                  <input className='form-input' name='description' value={form.description} onChange={onChange} placeholder='e.g. 40% off on first order' />
                </div>

                <div className='form-grid-3'>
                  <div className='form-group'>
                    <label>{form.discountType === 'percentage' ? 'Discount %' : 'Flat Amount (₹)'} *</label>
                    <input className='form-input' name='discountValue' type='number' value={form.discountValue} onChange={onChange} required placeholder={form.discountType === 'percentage' ? '40' : '100'} />
                  </div>
                  <div className='form-group'>
                    <label>Min Order Amount (₹)</label>
                    <input className='form-input' name='minOrderAmount' type='number' value={form.minOrderAmount} onChange={onChange} />
                  </div>
                  <div className='form-group'>
                    <label>Max Discount (₹)</label>
                    <input className='form-input' name='maxDiscount' type='number' value={form.maxDiscount} onChange={onChange} />
                  </div>
                </div>

                <div className='form-grid-2'>
                  <div className='form-group'>
                    <label>Usage Limit</label>
                    <input className='form-input' name='usageLimit' type='number' value={form.usageLimit} onChange={onChange} />
                  </div>
                  <div className='form-group'>
                    <label>Expiry Date *</label>
                    <input className='form-input' name='expiryDate' type='date' value={form.expiryDate} onChange={onChange} required min={new Date().toISOString().slice(0,10)} />
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-outline' onClick={() => setShowModal(false)}>Cancel</button>
                <button type='submit' className='btn btn-primary' disabled={loading}>
                  {loading ? 'Saving...' : editMode ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Coupons
