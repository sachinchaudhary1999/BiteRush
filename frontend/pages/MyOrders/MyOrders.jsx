import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext'
import OrderTracking from '../../components/OrderTracking/OrderTracking'

const statusClass = { 'Food Processing': 'status-processing', 'Out for delivery': 'status-processing', 'Delivered': 'status-delivered', 'Cancelled': 'status-cancelled' }

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [trackingOrder, setTrackingOrder] = useState(null)
  const { url, token } = useContext(StoreContext)

  const fetchOrders = async () => {
    try {
      const res = await axios.post(url + '/api/order/userorders', {}, { headers: { token } })
      setOrders(res.data.data)
    } catch {}
  }

  useEffect(() => { if (token) fetchOrders() }, [token])

  const filtered = orders.filter(o => activeTab === 'all' ? true : activeTab === 'active' ? o.status !== 'Delivered' : o.status === 'Delivered')

  return (
    <div className='my-orders'>
      <div className='my-orders-header'>
        <h1>📦 My Orders</h1>
        <div className='my-orders-tabs'>
          {['all', 'active', 'past'].map(t => (
            <div key={t} className={`orders-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>
      </div>

      {trackingOrder && <OrderTracking orderId={trackingOrder} />}

      <div className='orders-list'>
        {filtered.length === 0
          ? <div className='orders-empty'>
              <p>📦</p>
              <h3>No orders yet</h3>
              <p>Your orders will appear here</p>
            </div>
          : filtered.map((order, i) => (
              <div key={i} className='order-card'>
                <div className='order-card-header'>
                  <div className='order-card-restaurant'>
                    <div style={{fontSize:32}}>🍽️</div>
                    <div>
                      <div className='order-card-restaurant-name'>BiteRush Kitchen</div>
                      <div className='order-card-restaurant-sub'>Order #{order._id?.slice(-6)?.toUpperCase() || 'BRH001'}</div>
                    </div>
                  </div>
                  <span className={`order-status-badge ${statusClass[order.status] || 'status-processing'}`}>
                    {order.status}
                  </span>
                </div>

                <div className='order-card-body'>
                  {order.items.map((item, j) => (
                    <span key={j} className='order-dish-chip'>{item.name} × {item.quantity}</span>
                  ))}
                </div>

                <div className='order-card-footer'>
                  <div>
                    <div className='order-amount'>₹{(order.amount * 80).toFixed(0)}</div>
                    <div className='order-date'>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div className='order-card-actions'>
                    <button className='order-btn-secondary' onClick={() => setTrackingOrder(order._id)}>Track Order</button>
                    <button className='order-btn-primary'>Reorder</button>
                  </div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default MyOrders
