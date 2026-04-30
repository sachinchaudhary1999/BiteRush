// ============================================================
// STAT CARD — Reusable dashboard metric card
// Shows icon, label, value, and optional change indicator
// ============================================================
import React from 'react'
import './StatCard.css'

const StatCard = ({ icon, label, value, change, changeType = 'up', color = '#e23744', subtitle }) => {
  return (
    <div className='stat-card' style={{ borderLeftColor: color }}>
      {/* Icon circle with matching background tint */}
      <div className='stat-card-icon' style={{ background: color + '18' }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
      </div>
      <div className='stat-card-body'>
        <div className='stat-card-label'>{label}</div>
        <div className='stat-card-value'>{value}</div>
        {subtitle && <div className='stat-card-subtitle'>{subtitle}</div>}
        {/* Change indicator — green arrow for up, red for down */}
        {change !== undefined && (
          <div className={`stat-card-change ${changeType}`}>
            {changeType === 'up' ? '↑' : '↓'} {change}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
