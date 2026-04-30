// ============================================================
// USERS PAGE (Super Admin only)
// View all registered users, block/unblock, remove
// API: GET /api/users/list
//      POST /api/users/block | /api/users/remove
// ============================================================
import React, { useEffect, useState } from 'react'
import './Users.css'
import axios from 'axios'
import { url } from '../../assets/assets'
import { toast } from 'react-toastify'

const Users = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/api/users/list`)
      if (res.data.success) setUsers(res.data.data)
      else toast.error('Failed to load users')
    } catch { toast.error('Server error') }
  }

  useEffect(() => { fetchUsers() }, [])

  // Block or unblock a user — toggles the blocked field
  const toggleBlock = async (id, isBlocked) => {
    const res = await axios.post(`${url}/api/users/block`, { id, block: !isBlocked })
    if (res.data.success) { toast.success(res.data.message); fetchUsers() }
  }

  // Permanently remove a user account
  const removeUser = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return
    const res = await axios.post(`${url}/api/users/remove`, { id })
    if (res.data.success) { toast.success('User removed'); fetchUsers() }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className='page-header'>
        <div>
          <h1>👥 Users</h1>
          <p>{users.length} registered users</p>
        </div>
      </div>

      <div className='filter-bar'>
        <div className='search-input-wrap'>
          <span className='search-icon'>🔍</span>
          <input type='text' placeholder='Search by name or email...' value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className='btn btn-outline' onClick={fetchUsers}>🔄 Refresh</button>
      </div>

      <div className='card'>
        <table className='data-table'>
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No users found</td></tr>
            )}
            {filtered.map((u, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div className='user-avatar'>{u.name?.[0]?.toUpperCase()}</div>
                    <span className='font-600'>{u.name}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.blocked ? 'badge-danger' : 'badge-success'}`}>{u.blocked ? 'Blocked' : 'Active'}</span></td>
                <td>
                  <div style={{display:'flex',gap:8}}>
                    {/* Block / Unblock */}
                    <button className={`btn btn-sm ${u.blocked ? 'btn-success' : 'btn-warning'}`} onClick={() => toggleBlock(u._id, u.blocked)}>
                      {u.blocked ? '🔓 Unblock' : '🚫 Block'}
                    </button>
                    {/* Delete */}
                    <button className='btn btn-sm btn-danger' onClick={() => removeUser(u._id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default Users
