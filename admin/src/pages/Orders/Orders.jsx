// ============================================================
// ORDERS PAGE
// Shows all orders. Admin can update delivery status.
// Status flow: Food Processing → Out for delivery → Delivered
// API: GET /api/order/list
//      POST /api/order/status
// ============================================================
import React, { useEffect, useState } from 'react'
import './Orders.css'
import axios from 'axios'
import { url } from '../../assets/assets'
import { toast } from 'react-toastify'

// Status options — must match backend enum values
const statusOptions = ['Food Processing', 'Out for delivery', 'Delivered']

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/list`)
      if (res.data.success) {
        // Sort newest first
        setOrders(res.data.data.reverse())
      } else { toast.error('Failed to load orders') }
    } catch { toast.error('Cannot connect to server') }
  }

  useEffect(() => { fetchOrders() }, [])

  // Update order status — called when admin changes dropdown
  const updateStatus = async (orderId, status) => {
    const res = await axios.post(`${url}/api/order/status`, { orderId, status })
    if (res.data.success) {
      toast.success(`Status updated to: ${status}`)
      fetchOrders()  // Refresh list after update
    } else { toast.error('Failed to update status') }
  }

  // Filter by search term (customer name or order ID) and status
  const filtered = orders.filter(o => {
    const name = `${o.address?.firstName} ${o.address?.lastName}`.toLowerCase()
    const matchSearch = name.includes(search.toLowerCase()) || o._id?.includes(search)
    const matchStatus = statusFilter === 'All' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  // Badge color per status
  const statusBadge = {
    'Food Processing': 'badge-warning',
    'Out for delivery': 'badge-info',
    'Delivered': 'badge-success'
  }

  return (
    <div>
      <div className='page-header'>
        <div>
          <h1>📋 All Orders</h1>
          <p>{orders.length} total orders</p>
        </div>
        <button className='btn btn-outline' onClick={fetchOrders}>🔄 Refresh</button>
      </div>

      {/* ---- Order Summary Chips ---- */}
      <div className='order-summary-chips'>
        {['All', ...statusOptions].map(s => (
          <button
            key={s}
            className={`order-chip ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s === 'All' ? `All (${orders.length})` :
             s === 'Food Processing' ? `⏳ Processing (${orders.filter(o=>o.status===s).length})` :
             s === 'Out for delivery' ? `🛵 Out for Delivery (${orders.filter(o=>o.status===s).length})` :
             `✅ Delivered (${orders.filter(o=>o.status===s).length})`}
          </button>
        ))}
      </div>

      {/* ---- Search ---- */}
      <div className='filter-bar'>
        <div className='search-input-wrap'>
          <span className='search-icon'>🔍</span>
          <input type='text' placeholder='Search by customer name or order ID...' value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* ---- Orders Table ---- */}
      <div className='card'>
        <table className='data-table'>
          <thead>
            <tr>
              <th>Order ID</th><th>Customer</th><th>Items</th>
              <th>Amount</th><th>Payment</th><th>Status</th><th>Update</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No orders found</td></tr>
            )}
            {filtered.map((order, i) => (
              <tr key={i}>
                {/* Show last 6 chars of MongoDB ObjectId as short ID */}
                <td>
                  <div className='font-600'>#{order._id?.slice(-6)?.toUpperCase()}</div>
                  <div style={{fontSize:11,color:'var(--text-hint)'}}>
                    {new Date(order.date).toLocaleDateString('en-IN')}
                  </div>
                </td>
                <td>
                  <div className='font-600'>{order.address?.firstName} {order.address?.lastName}</div>
                  <div style={{fontSize:12,color:'var(--text-muted)'}}>{order.address?.phone}</div>
                  <div style={{fontSize:11,color:'var(--text-hint)',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {order.address?.street}, {order.address?.city}
                  </div>
                </td>
                <td>
                  {/* Show each item on its own line */}
                  <div style={{fontSize:13}}>
                    {order.items?.map((item, j) => (
                      <div key={j}>{item.name} × {item.quantity}</div>
                    ))}
                  </div>
                </td>
                <td className='font-bold' style={{color:'var(--red)'}}>
                  ₹{(order.amount * 80).toFixed(0)}
                </td>
                <td>
                  {/* Payment status — set by Stripe webhook on success */}
                  <span className={`badge ${order.payment ? 'badge-success' : 'badge-danger'}`}>
                    {order.payment ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${statusBadge[order.status] || 'badge-grey'}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {/* Dropdown to change order status — triggers API call on change */}
                  <select
                    className='status-select'
                    value={order.status}
                    onChange={e => updateStatus(order._id, e.target.value)}
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Orders
