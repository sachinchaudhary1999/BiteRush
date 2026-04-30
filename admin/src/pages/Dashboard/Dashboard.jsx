// ============================================================
// DASHBOARD PAGE
// Shows live stats from backend: orders, revenue, users, etc.
// Also shows recent orders table and revenue chart (bar chart)
// API: GET /api/analytics/dashboard
// ============================================================
import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import axios from 'axios'
import { url } from '../../assets/assets'
import StatCard from '../../components/StatCard/StatCard'
import { toast } from 'react-toastify'

const Dashboard = () => {
  // All stats from backend
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch dashboard analytics on mount
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${url}/api/analytics/dashboard`)
      if (res.data.success) {
        setStats(res.data.data)
      } else {
        toast.error('Failed to load dashboard stats')
      }
    } catch (e) {
      toast.error('Cannot connect to server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  if (loading) return (
    <div className='dashboard-loading'>
      <div className='spinner'></div>
      <p>Loading dashboard...</p>
    </div>
  )

  // Find the max revenue day for scaling the bar chart
  const maxRevenue = stats ? Math.max(...(stats.revenueByDay || []).map(d => d.revenue), 1) : 1

  return (
    <div className='dashboard'>
      {/* ---- Page Header ---- */}
      <div className='page-header'>
        <div>
          <h1>Dashboard 📊</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
        <button className='btn btn-primary' onClick={fetchStats}>🔄 Refresh</button>
      </div>

      {/* ---- Stat Cards Row ---- */}
      <div className='dashboard-stats-grid'>
        <StatCard icon='📦' label='Total Orders'      value={stats?.totalOrders || 0}       color='#e23744' change='12% vs last week' changeType='up' />
        <StatCard icon='💰' label='Total Revenue'     value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`} color='#27ae60' change='8% vs last week' changeType='up' />
        <StatCard icon='👥' label='Registered Users'  value={stats?.totalUsers || 0}         color='#2980b9' change='5 new today' changeType='up' />
        <StatCard icon='🏪' label='Restaurants'       value={stats?.totalRestaurants || 0}   color='#f39c12' subtitle='Active partners' />
        <StatCard icon='🛵' label='Delivery Partners' value={stats?.totalPartners || 0}      color='#8e44ad' subtitle='On platform' />
        <StatCard icon='✅' label='Delivered Orders'  value={stats?.deliveredOrders || 0}   color='#27ae60' subtitle='Successfully completed' />
        <StatCard icon='⏳' label='Pending Orders'    value={stats?.pendingOrders || 0}     color='#e67e22' subtitle='Awaiting processing' />
        <StatCard icon='🍽️' label='Food Items'         value={stats?.totalFoods || 0}         color='#e23744' subtitle='In menu' />
      </div>

      {/* ---- Revenue Chart + Recent Orders ---- */}
      <div className='dashboard-bottom'>
        {/* Bar chart — last 7 days revenue */}
        <div className='card dashboard-chart'>
          <div className='chart-header'>
            <h2>Revenue Last 7 Days</h2>
            <span className='chart-subtitle'>Daily revenue in ₹</span>
          </div>
          <div className='bar-chart'>
            {(stats?.revenueByDay || []).map((day, i) => (
              <div key={i} className='bar-item'>
                {/* Bar height proportional to max revenue */}
                <div className='bar-wrap'>
                  <span className='bar-value'>₹{day.revenue.toLocaleString('en-IN')}</span>
                  <div
                    className='bar'
                    style={{ height: `${Math.max((day.revenue / maxRevenue) * 160, 4)}px` }}
                  />
                </div>
                <span className='bar-label'>{day.date}</span>
                <span className='bar-orders'>{day.orders} orders</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders table */}
        <div className='card dashboard-recent'>
          <h2>Recent Orders</h2>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentOrders || []).map((order, i) => (
                <tr key={i}>
                  <td>#{order._id?.slice(-6)?.toUpperCase()}</td>
                  <td>₹{(order.amount * 80).toFixed(0)}</td>
                  <td>
                    <span className={`badge ${
                      order.status === 'Delivered' ? 'badge-success' :
                      order.status === 'Out for delivery' ? 'badge-info' : 'badge-warning'
                    }`}>{order.status}</span>
                  </td>
                  <td>
                    <span className={`badge ${order.payment ? 'badge-success' : 'badge-danger'}`}>
                      {order.payment ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {!stats?.recentOrders?.length && (
                <tr><td colSpan={4} style={{textAlign:'center', color:'var(--text-muted)', padding:'30px'}}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
