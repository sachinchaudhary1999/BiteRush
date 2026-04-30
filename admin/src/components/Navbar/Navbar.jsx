// ============================================================
// ADMIN NAVBAR
// Top bar with logo, role badge, and profile menu
// ============================================================
import React from 'react'
import './Navbar.css'

const Navbar = ({ role = 'superadmin' }) => {
  // Role display label — shown as a badge next to the logo
  const roleLabel = {
    superadmin: { label: '👑 Super Admin', color: '#e23744' },
    restaurant: { label: '🍽️ Restaurant Owner', color: '#f39c12' },
    delivery: { label: '🛵 Delivery Partner', color: '#27ae60' },
  }[role] || { label: 'Admin', color: '#2980b9' };

  return (
    <div className='admin-navbar'>
      {/* Left: Logo + Role Badge */}
      <div className='admin-navbar-left'>
        <span className='admin-navbar-logo'>BiteRush</span>
        <span className='admin-navbar-sub'>Admin Panel</span>
        <span className='admin-role-badge' style={{ background: roleLabel.color }}>
          {roleLabel.label}
        </span>
      </div>

      {/* Right: Notifications + Profile */}
      <div className='admin-navbar-right'>
        <div className='admin-navbar-icon' title='Notifications'>
          🔔
          <span className='notif-dot'></span>
        </div>
        <div className='admin-navbar-icon' title='Settings'>⚙️</div>
        <div className='admin-navbar-profile'>
          <div className='admin-avatar'>A</div>
          <div className='admin-profile-info'>
            <span className='admin-profile-name'>Administrator</span>
            <span className='admin-profile-role'>{roleLabel.label}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
