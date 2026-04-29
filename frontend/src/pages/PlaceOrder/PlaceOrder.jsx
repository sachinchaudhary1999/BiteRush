import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)
  const [payment, setPayment] = useState('cod')
  const [data, setData] = useState({ firstName:'', lastName:'', email:'', street:'', city:'', state:'', zipcode:'', country:'India', phone:'' })
  const subtotal = getTotalCartAmount() * 80
  const delivery = subtotal > 0 ? 40 : 0
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + delivery + tax

  const onChange = e => setData(d => ({ ...d, [e.target.name]: e.target.value }))

  const placeOrder = async e => {
    e.preventDefault()
    const items = food_list.filter(i => cartItems[i._id] > 0).map(i => ({ ...i, quantity: cartItems[i._id] }))
    const orderData = { address: data, items, amount: total / 80 }
    try {
      const res = await axios.post(url + '/api/order/place', orderData, { headers: { token } })
      if (res.data.success) {
        window.location.replace(res.data.session_url)
      } else {
        toast.error('Order failed. Try again.')
      }
    } catch {
      toast.error('Something went wrong.')
    }
  }

  return (
    <form className='place-order' onSubmit={placeOrder}>
      <div>
        <div className='order-form-section'>
          <h2>📍 Delivery Address</h2>
          <div className='form-row'>
            <div className='form-group'><label>First Name</label><input name='firstName' value={data.firstName} onChange={onChange} placeholder='John' required /></div>
            <div className='form-group'><label>Last Name</label><input name='lastName' value={data.lastName} onChange={onChange} placeholder='Doe' required /></div>
          </div>
          <div className='form-group'><label>Email</label><input name='email' type='email' value={data.email} onChange={onChange} placeholder='john@example.com' required /></div>
          <div className='form-group'><label>Phone</label><input name='phone' value={data.phone} onChange={onChange} placeholder='+91 98765 43210' required /></div>
          <div className='form-group'><label>Street Address</label><input name='street' value={data.street} onChange={onChange} placeholder='123 Main Street, Apt 4B' required /></div>
          <div className='form-row'>
            <div className='form-group'><label>City</label><input name='city' value={data.city} onChange={onChange} placeholder='Bengaluru' required /></div>
            <div className='form-group'><label>State</label><input name='state' value={data.state} onChange={onChange} placeholder='Karnataka' required /></div>
          </div>
          <div className='form-row'>
            <div className='form-group'><label>Pin Code</label><input name='zipcode' value={data.zipcode} onChange={onChange} placeholder='560001' required /></div>
            <div className='form-group'><label>Country</label><input name='country' value={data.country} onChange={onChange} placeholder='India' required /></div>
          </div>
          <hr className='form-section-divider' />
          <h2>💳 Payment Method</h2>
          <div className='payment-methods'>
            {[
              { id:'cod', icon:'💵', label:'Cash on Delivery', sub:'Pay when your order arrives' },
              { id:'card', icon:'💳', label:'Credit / Debit Card', sub:'Visa, Mastercard, RuPay' },
              { id:'upi', icon:'📱', label:'UPI', sub:'GPay, PhonePe, Paytm & more' },
              { id:'wallet', icon:'👛', label:'Wallets', sub:'Paytm, Amazon Pay, etc.' },
            ].map(p => (
              <div key={p.id} className={`payment-option ${payment === p.id ? 'selected' : ''}`} onClick={() => setPayment(p.id)}>
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

      <div className='order-summary-section'>
        <div className='summary-card'>
          <h3>Order Summary</h3>
          {food_list.filter(i => cartItems[i._id] > 0).map((item, i) => (
            <div key={i} className='summary-item'>
              <span>{item.name} × {cartItems[item._id]}</span>
              <span>₹{item.price * 80 * cartItems[item._id]}</span>
            </div>
          ))}
          <hr className='summary-divider' />
          <div className='summary-item'><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className='summary-item'><span>Delivery</span><span>₹{delivery}</span></div>
          <div className='summary-item'><span>GST (5%)</span><span>₹{tax}</span></div>
          <hr className='summary-divider' />
          <div className='summary-total'><span>Total</span><span>₹{total}</span></div>
        </div>

        <button type='submit' className='place-order-btn'>
          {payment === 'cod' ? '🛵 Place Order' : '🔒 Pay ₹' + total}
        </button>

        <div className='order-trust'>
          <div className='trust-item'>🔒 100% secure payments</div>
          <div className='trust-item'>📦 Estimated delivery: 30–45 mins</div>
          <div className='trust-item'>↩️ Easy cancellation & refund</div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
