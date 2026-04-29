import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {
  const { setToken, url, loadCartData } = useContext(StoreContext)
  const [tab, setTab] = useState('login')
  const [data, setData] = useState({ name: '', email: '', password: '' })

  const onChange = e => setData(d => ({ ...d, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    const endpoint = tab === 'login' ? '/api/user/login' : '/api/user/register'
    try {
      const res = await axios.post(url + endpoint, data)
      if (res.data.success) {
        setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
        loadCartData({ token: res.data.token })
        setShowLogin(false)
        toast.success(tab === 'login' ? 'Welcome back! 🍅' : 'Account created! 🎉')
      } else {
        toast.error(res.data.message)
      }
    } catch {
      toast.error('Something went wrong. Try again.')
    }
  }

  return (
    <div className='login-popup' onClick={() => setShowLogin(false)}>
      <div className='login-popup-box' onClick={e => e.stopPropagation()}>
        <div className='login-popup-banner'>
          <h2>{tab === 'login' ? 'Welcome back! 👋' : 'Join Tomato 🍅'}</h2>
          <p>{tab === 'login' ? 'Sign in to continue ordering' : 'Create your free account today'}</p>
          <span className='login-popup-close' onClick={() => setShowLogin(false)}>✕</span>
        </div>

        <div className='login-popup-body'>
          <div className='login-popup-tabs'>
            <div className={`login-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Sign In</div>
            <div className={`login-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>Create Account</div>
          </div>

          <form onSubmit={onSubmit}>
            <div className='login-popup-inputs'>
              {tab === 'signup' && (
                <input name='name' value={data.name} onChange={onChange} type='text' placeholder='Full name' required />
              )}
              <input name='email' value={data.email} onChange={onChange} type='email' placeholder='Email address' required />
              <input name='password' value={data.password} onChange={onChange} type='password' placeholder='Password' required />
            </div>

            {tab === 'login' && (
              <div className='login-popup-forgot'>Forgot password?</div>
            )}

            <button type='submit' className='login-popup-submit'>
              {tab === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          <div className='login-popup-divider'>or continue with</div>

          <div className='login-social-btns'>
            <button className='login-social-btn'>🔴 Google</button>
            <button className='login-social-btn'>📘 Facebook</button>
          </div>

          <p className='login-terms'>
            By continuing, you agree to our <a>Terms of Service</a> and <a>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPopup
