// ============================================================
// CART PAGE
// Shows cart items, bill summary, coupon apply, checkout button
// Coupon validation hits /api/coupon/validate via StoreContext
// ============================================================
import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Cart = () => {
  const {
    cartItems, food_list, removeFromCart, addToCart,
    getTotalCartAmount, url,
    applyCoupon, removeCoupon, discount, appliedCoupon
  } = useContext(StoreContext)

  const navigate = useNavigate()
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  // All items currently in cart (qty > 0)
  const items = food_list.filter(item => cartItems[item._id] > 0)

  // Price calculations in INR (backend stores USD, we × 80)
  const subtotal  = getTotalCartAmount() * 80
  const delivery  = subtotal > 0 && subtotal < 299 ? 40 : 0
  const tax       = Math.round(subtotal * 0.05)
  const savings   = Math.round(subtotal * 0.2)
  const total     = subtotal + delivery + tax - discount

  // ---- Apply coupon via context (hits backend) ----
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return toast.error('Enter a coupon code')
    setCouponLoading(true)
    const result = await applyCoupon(couponInput.trim())
    if (result.success) {
      toast.success(result.message)
      setCouponInput('')
    } else {
      toast.error(result.message)
    }
    setCouponLoading(false)
  }

  return (
    <div className='cart-page'>
      <h1>🛒 Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>

      <div className='cart-layout'>

        {/* ---- LEFT: Item List ---- */}
        <div className='cart-items-section'>
          {items.length === 0 ? (
            // Empty state
            <div className='cart-empty-state'>
              <p>🛒</p>
              <h3>Your cart is empty</h3>
              <p>Add some delicious food to get started!</p>
              <button className='cart-empty-btn' onClick={() => navigate('/')}>
                Browse Restaurants
              </button>
            </div>
          ) : (
            <>
              <div className='cart-restaurant-header'>🍽️ Tomato Kitchen</div>
              <div className='cart-items-list'>
                {items.map((item, i) => (
                  <div key={i} className='cart-item'>
                    {/* Food image from backend /images/ static route */}
                    <img
                      className='cart-item-img'
                      src={url + '/images/' + item.image}
                      alt={item.name}
                    />
                    <div className='cart-item-info'>
                      <div className='cart-item-name'>{item.name}</div>
                      <div className='cart-item-price'>₹{item.price * 80} each</div>
                    </div>

                    {/* +/- quantity controls */}
                    <div className='cart-item-controls'>
                      <button className='cart-item-btn' onClick={() => removeFromCart(item._id)}>−</button>
                      <span className='cart-item-qty'>{cartItems[item._id]}</span>
                      <button className='cart-item-btn' onClick={() => addToCart(item._id)}>+</button>
                    </div>

                    <div className='cart-item-total'>
                      ₹{item.price * 80 * cartItems[item._id]}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ---- RIGHT: Summary + Coupon ---- */}
        <div className='cart-right'>

          {/* Free delivery progress nudge */}
          {subtotal > 0 && subtotal < 299 && (
            <div className='cart-delivery-info'>
              🚴 Add ₹{299 - subtotal} more for <b>FREE delivery</b>
            </div>
          )}
          {subtotal >= 299 && subtotal > 0 && (
            <div className='cart-delivery-info free'>
              ✅ You've unlocked <b>FREE delivery!</b>
            </div>
          )}

          {/* Coupon input */}
          <div className='cart-promo-section'>
            <h3>🏷️ Apply Coupon</h3>

            {/* Show applied coupon as a chip if one is active */}
            {appliedCoupon ? (
              <div className='coupon-applied-chip'>
                <span>🏷️ <b>{appliedCoupon}</b> — ₹{discount} OFF applied!</span>
                <button onClick={removeCoupon}>✕</button>
              </div>
            ) : (
              <div className='cart-promo-input'>
                <input
                  type='text'
                  placeholder='Enter coupon (e.g. WELCOME40)'
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button onClick={handleApplyCoupon} disabled={couponLoading}>
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
            )}
          </div>

          {/* Bill breakdown */}
          <div className='cart-bill-section'>
            <h3>Bill Details</h3>
            <div className='cart-bill-row'><span>Item Total</span><span>₹{subtotal}</span></div>
            <div className='cart-bill-row'>
              <span>Delivery Fee</span>
              <span style={{ color: delivery === 0 ? '#27ae60' : 'inherit' }}>
                {delivery === 0 ? 'FREE' : `₹${delivery}`}
              </span>
            </div>
            <div className='cart-bill-row'><span>GST (5%)</span><span>₹{tax}</span></div>

            {/* Show discount line only if a coupon is applied */}
            {discount > 0 && (
              <div className='cart-bill-row' style={{ color: '#27ae60', fontWeight: 600 }}>
                <span>🏷️ Coupon Discount</span><span>− ₹{discount}</span>
              </div>
            )}

            <hr className='cart-bill-divider' />
            <div className='cart-bill-row total'>
              <span>To Pay</span>
              <span>₹{Math.max(total, 0)}</span>
            </div>

            {savings > 0 && (
              <div className='cart-savings'>🎉 You saved ₹{savings + discount} on this order!</div>
            )}

            <button
              className='cart-checkout-btn'
              onClick={() => navigate('/order')}
              disabled={items.length === 0}
            >
              Proceed to Checkout →
            </button>
            <div className='safe-payment'>🔒 100% Secure Payments</div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart
