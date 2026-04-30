// ============================================================
// ADMIN PANEL — Root App Component
// Sets up routing for all admin pages
// Role is hardcoded as 'superadmin' here — in production
// you'd decode it from a JWT token after admin login
// ============================================================
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ---- Layout Components ----
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'

// ---- Pages ----
import Dashboard from './pages/Dashboard/Dashboard'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Restaurants from './pages/Restaurants/Restaurants'
import DeliveryPartners from './pages/DeliveryPartners/DeliveryPartners'
import Users from './pages/Users/Users'
import Coupons from './pages/Coupons/Coupons'

// ---- Current admin role ----
// Change this to 'restaurant' or 'delivery' to see role-limited sidebar
const ROLE = 'superadmin'

const App = () => {
  return (
    <div className='admin-shell'>
      {/* Toast notifications — shown on all pages */}
      <ToastContainer position='top-right' autoClose={3000} />

      {/* Fixed top navbar */}
      <Navbar role={ROLE} />

      {/* Fixed left sidebar — items filtered by role */}
      <Sidebar role={ROLE} />

      {/* Main content area — scrollable, offset from sidebar */}
      <main className='admin-main'>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path='/' element={<Navigate to='/dashboard' replace />} />

          {/* Core pages — visible to superadmin and admin */}
          <Route path='/dashboard'   element={<Dashboard />} />
          <Route path='/add'         element={<Add />} />
          <Route path='/food'        element={<List />} />
          <Route path='/list'        element={<List />} />       {/* legacy route */}
          <Route path='/orders'      element={<Orders />} />

          {/* Extended pages — superadmin only */}
          <Route path='/restaurants' element={<Restaurants />} />
          <Route path='/delivery'    element={<DeliveryPartners />} />
          <Route path='/users'       element={<Users />} />
          <Route path='/coupons'     element={<Coupons />} />

          {/* Fallback — redirect unknown routes to dashboard */}
          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
