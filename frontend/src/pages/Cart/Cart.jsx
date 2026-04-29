import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url } = useContext(StoreContext)
  const navigate = useNavigate()
  const items = food_list.filter(item => cartItems[item._id] > 0)
  const subtotal = getTotalCartAmount() * 80
  const delivery = subtotal > 0 ? 40 : 0
  const savings = Math.round(subtotal * 0.2)

  return (
    <div className='cart-page'>
      <h1>🛒 Your Cart ({items.length} items)</h1>
      <div className='cart-layout'>
        {/* Left: Items */}
        <div className='cart-items-section'>
          {items.length === 0
            ? <div className='cart-empty-state'>
                <p>🛒</p>
                <h3>Your cart is empty</h3>
                <p>Add some delicious food to get started!</p>
                <button className='cart-empty-btn' onClick={() => navigate('/')}>Browse Restaurants</button>
              </div>
            : <>
                <div className='cart-restaurant-header'>🍽️ Tomato Kitchen</div>
                <div className='cart-items-list'>
                  {items.map((item, i) => (
                    <div key={i} className='cart-item'>
                      <img className='cart-item-img' src={url + '/images/' + item.image} alt={item.name} />
                      <div className='cart-item-info'>
                        <div className='cart-item-name'>{item.name}</div>
                        <div className='cart-item-price'>₹{item.price * 80} each</div>
                      </div>
                      <div className='cart-item-controls'>
                        <button className='cart-item-btn' onClick={() => removeFromCart(item._id)}>−</button>
                        <span className='cart-item-qty'>{cartItems[item._id]}</span>
                        <button className='cart-item-btn' onClick={() => addToCart(item._id)}>+</button>
                      </div>
                      <div className='cart-item-total'>₹{item.price * 80 * cartItems[item._id]}</div>
                    </div>
                  ))}
                </div>
              </>
          }
        </div>

        {/* Right: Summary */}
        <div className='cart-right'>
          {subtotal > 0 && (
            <div className='cart-delivery-info'>
              🚴 {subtotal >= 299 ? '✅ You get FREE delivery on this order!' : `Add ₹${299 - subtotal} more for free delivery`}
            </div>
          )}

          <div className='cart-promo-section'>
            <h3>🏷️ Apply Promo Code</h3>
            <div className='cart-promo-input'>
              <input type='text' placeholder='Enter code (e.g. WELCOME40)' />
              <button>Apply</button>
            </div>
          </div>

          <div className='cart-bill-section'>
            <h3>Bill Details</h3>
            <div className='cart-bill-row'><span>Item Total</span><span>₹{subtotal}</span></div>
            <div className='cart-bill-row'><span>Delivery Fee</span><span style={{color: delivery === 0 ? '#2e7d32' : 'inherit'}}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
            <div className='cart-bill-row'><span>GST & Charges</span><span>₹{Math.round(subtotal * 0.05)}</span></div>
            <hr className='cart-bill-divider' />
            <div className='cart-bill-row total'>
              <span>To Pay</span>
              <span>₹{subtotal + delivery + Math.round(subtotal * 0.05)}</span>
            </div>
            {savings > 0 && <div className='cart-savings'>🎉 You saved ₹{savings} on this order!</div>}
            <button className='cart-checkout-btn' onClick={() => navigate('/order')}>
              Proceed to Checkout →
            </button>
            <div className='safe-payment'>🔒 Safe and Secure Payments</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
