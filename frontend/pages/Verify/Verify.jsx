// ============================================================
// VERIFY PAGE
// Handles Stripe payment callback after online checkout
// Stripe redirects to /verify?success=true&orderId=xxx
// We call /api/order/verify to confirm + clear the cart
// ============================================================
import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext'
import { toast } from 'react-toastify'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const { url, setCartItems } = useContext(StoreContext)
  const navigate = useNavigate()

  // Read query params Stripe sends back
  const success  = searchParams.get('success')
  const orderId  = searchParams.get('orderId')

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(url + '/api/order/verify', { success, orderId })
        if (res.data.success) {
          // Clear cart on successful payment
          setCartItems({})
          toast.success('🎉 Payment successful! Order confirmed.')
          navigate('/myorders')
        } else {
          toast.error('Payment failed or was cancelled.')
          navigate('/cart')
        }
      } catch {
        toast.error('Verification failed. Please contact support.')
        navigate('/')
      }
    }
    verify()
  }, [])

  return (
    <div className='verify-page'>
      <div className='verify-spinner'></div>
      <p>Verifying your payment...</p>
      <p className='verify-sub'>Please don't close this page</p>
    </div>
  )
}

export default Verify
