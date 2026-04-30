// ============================================================
// ADMIN SIDEBAR
// Navigation menu — items change based on user role
// superadmin: sees everything
// restaurant: sees only their menu + orders
// delivery: sees only assigned orders
// ============================================================
import React, { useState } from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'

// All sidebar navigation items with icons, labels, and paths
const navItems = [
  { icon: '📊', label: 'Dashboard',         path: '/dashboard',  roles: ['superadmin', 'admin'] },
  { icon: '🍽️', label: 'Food Items',         path: '/food',       roles: ['superadmin', 'admin', 'restaurant'] },
  { icon: '➕', label: 'Add Food',           path: '/add',        roles: ['superadmin', 'admin', 'restaurant'] },
  { icon: '📋', label: 'All Orders',         path: '/orders',     roles: ['superadmin', 'admin', 'restaurant'] },
  { icon: '🏪', label: 'Restaurants',        path: '/restaurants',roles: ['superadmin', 'admin'] },
  { icon: '🛵', label: 'Delivery Partners',  path: '/delivery',   roles: ['superadmin', 'admin'] },
  { icon: '👥', label: 'Users',             path: '/users',      roles: ['superadmin'] },
  { icon: '🏷️', label: 'Coupons & Offers',  path: '/coupons',    roles: ['superadmin', 'admin'] },
  { icon: '📦', label: 'My Deliveries',     path: '/my-deliveries', roles: ['delivery'] },
  { icon: '💰', label: 'Earnings',          path: '/earnings',   roles: ['delivery', 'restaurant'] },
  { icon: '⭐', label: 'Reviews',           path: '/reviews',    roles: ['superadmin', 'admin', 'restaurant'] },
  { icon: '⚙️', label: 'Settings',          path: '/settings',   roles: ['superadmin', 'admin', 'restaurant', 'delivery'] },
]

const Sidebar = ({ role = 'superadmin' }) => {
  const [collapsed, setCollapsed] = useState(false)

  // Only show menu items the current role has access to
  const visibleItems = navItems.filter(item => item.roles.includes(role))

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Collapse toggle button */}
      <button className='sidebar-collapse-btn' onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '▶' : '◀'}
      </button>

      {/* Navigation Links */}
      <nav className='sidebar-nav'>
        {visibleItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <span className='sidebar-icon'>{item.icon}</span>
            {/* Hide label text when sidebar is collapsed */}
            {!collapsed && <span className='sidebar-label'>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: version info */}
      {!collapsed && (
        <div className='sidebar-footer'>
          <div className='sidebar-version'>� BiteRush Admin</div>
          <div className='sidebar-version-num'>v2.0.0 — 2025</div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
