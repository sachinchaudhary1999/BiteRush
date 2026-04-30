// ============================================================
// PLACE ORDER PAGE
// Delivery address form + payment method selection
// On submit: calls /api/order/place → gets Stripe session URL
// → redirects user to Stripe checkout page
// ============================================================
import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  const {
    getTotalCartAmount, token, food_list,
    cartItems, url, discount
  } = useContext(StoreContext)

  const navigate = useNavigate()
  const [payment, setPayment] = useState('cod')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    firstName:'', lastName:'', email:'',
    street:'', city:'', state:'',
    zipcode:'', country:'India', phone:''
  })

  const onChange = e => setData(d => ({ ...d, [e.target.name]: e.target.value }))

  // Build price summary (same logic as Cart page)
  const subtotal  = getTotalCartAmount() * 80
  const delivery  = subtotal > 0 && subtotal < 299 ? 40 : 0
  const tax       = Math.round(subtotal * 0.05)
  const total     = subtotal + delivery + tax - discount

  const placeOrder = async (e) => {
    e.preventDefault()
    if (!token) { toast.error('Please sign in first'); return }

    // Build order items array from cart state
    const orderItems = food_list
      .filter(i => cartItems[i._id] > 0)
      .map(i => ({ ...i, quantity: cartItems[i._id] }))

    if (orderItems.length === 0) {
      toast.error('Your cart is empty'); return
    }

    setLoading(true)
    try {
      const orderData = {
        address: data,
        items: orderItems,
        amount: total / 80,   // Backend stores amount in USD
      }

      if (payment === 'cod') {
        // COD: place order directly, go to my orders
        const res = await axios.post(url + '/api/order/place', orderData, { headers: { token } })
        if (res.data.success) {
          toast.success('🎉 Order placed successfully!')
          navigate('/myorders')
        } else {
          toast.error(res.data.message)
        }
      } else {
        // Online payment: get Stripe session URL and redirect
        const res = await axios.post(url + '/api/order/place', orderData, { headers: { token } })
        if (res.data.success) {
          // Stripe redirects back to /verify after payment
          window.location.replace(res.data.session_url)
        } else {
          toast.error(res.data.message)
        }
      }
    } catch (err) {
      toast.error('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  return (
    <form className='place-order' onSubmit={placeOrder}>

      {/* ---- LEFT: Address + Payment ---- */}
      <div>
        <div className='order-form-section'>
          <h2>📍 Delivery Address</h2>

          <div className='form-row'>
            <div className='form-group'>
              <label>First Name</label>
              <input name='firstName' value={data.firstName} onChange={onChange} required placeholder='John' />
            </div>
            <div className='form-group'>
              <label>Last Name</label>
              <input name='lastName' value={data.lastName} onChange={onChange} required placeholder='Doe' />
            </div>
          </div>

          <div className='form-group'>
            <label>Email Address</label>
            <input name='email' type='email' value={data.email} onChange={onChange} required placeholder='john@example.com' />
          </div>

          <div className='form-group'>
            <label>Phone Number</label>
            <input name='phone' value={data.phone} onChange={onChange} required placeholder='+91 98765 43210' />
          </div>

          <div className='form-group'>
            <label>Street Address</label>
            <input name='street' value={data.street} onChange={onChange} required placeholder='123 Main Street, Apt 4B' />
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>City</label>
              <input name='city' value={data.city} onChange={onChange} required placeholder='Bengaluru' />
            </div>
            <div className='form-group'>
              <label>State</label>
              <input name='state' value={data.state} onChange={onChange} required placeholder='Karnataka' />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>Pin Code</label>
              <input name='zipcode' value={data.zipcode} onChange={onChange} required placeholder='560001' />
            </div>
            <div className='form-group'>
              <label>Country</label>
              <input name='country' value={data.country} onChange={onChange} required placeholder='India' />
            </div>
          </div>

          <hr className='form-section-divider' />

          {/* ---- Payment Methods ---- */}
          <h2>💳 Payment Method</h2>
          <div className='payment-methods'>
            {[
              { id:'cod',    icon:'💵', label:'Cash on Delivery',   sub:'Pay when your order arrives' },
              { id:'upi',    icon:'📱', label:'UPI',                sub:'GPay, PhonePe, Paytm & more' },
              { id:'card',   icon:'💳', label:'Credit / Debit Card', sub:'Visa, Mastercard, RuPay' },
              { id:'wallet', icon:'👛', label:'Wallets',            sub:'Paytm, Amazon Pay, etc.' },
            ].map(p => (
              <div
                key={p.id}
                className={`payment-option ${payment === p.id ? 'selected' : ''}`}
                onClick={() => setPayment(p.id)}
              >
                <input type='radio' checked={payment === p.id} readOnly />
                <span className='payment-option-icon'>{p.icon}</span>
                <div className='payment-option-text'>
                  <p>{p.label}</p>
                  <p>{p.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- RIGHT: Order Summary ---- */}
      <div className='order-summary-section'>
        <div className='summary-card'>
          <h3>Order Summary</h3>

          {/* List all cart items */}
          {food_list.filter(i => cartItems[i._id] > 0).map((item, i) => (
            <div key={i} className='summary-item'>
              <span>{item.name} × {cartItems[item._id]}</span>
              <span>₹{item.price * 80 * cartItems[item._id]}</span>
            </div>
          ))}

          <hr className='summary-divider' />
          <div className='summary-item'><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className='summary-item'>
            <span>Delivery</span>
            <span style={{color: delivery === 0 ? '#27ae60' : 'inherit'}}>
              {delivery === 0 ? 'FREE' : `₹${delivery}`}
            </span>
          </div>
          <div className='summary-item'><span>GST (5%)</span><span>₹{tax}</span></div>

          {/* Show coupon discount if applied */}
          {discount > 0 && (
            <div className='summary-item' style={{color:'#27ae60',fontWeight:600}}>
              <span>🏷️ Coupon Discount</span><span>− ₹{discount}</span>
            </div>
          )}

          <hr className='summary-divider' />
          <div className='summary-total'>
            <span>Total</span>
            <span>₹{Math.max(total, 0)}</span>
          </div>
        </div>

        {/* Submit button — label changes based on payment method */}
        <button type='submit' className='place-order-btn' disabled={loading}>
          {loading ? '⏳ Placing Order...' :
           payment === 'cod' ? '🛵 Place Order (COD)' : `🔒 Pay ₹${Math.max(total, 0)}`}
        </button>

        {/* Trust signals */}
        <div className='order-trust'>
          <div className='trust-item'>🔒 100% secure payments</div>
          <div className='trust-item'>📦 Estimated delivery: 30–45 mins</div>
          <div className='trust-item'>↩️ Easy cancellation before dispatch</div>
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder
