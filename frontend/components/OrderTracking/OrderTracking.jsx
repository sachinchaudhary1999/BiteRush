import React, { useState, useEffect } from 'react'
import './OrderTracking.css'

const steps = [
  { icon: '✅', label: 'Order Placed' },
  { icon: '👨‍🍳', label: 'Preparing' },
  { icon: '🛵', label: 'On the Way' },
  { icon: '🏠', label: 'Delivered' },
]

const OrderTracking = ({ orderId }) => {
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(s => s < steps.length - 1 ? s + 1 : s)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className='order-tracking'>
      <h2>📦 Track Your Order</h2>
      <div className='tracking-card'>
        <div className='tracking-restaurant'>Order #{orderId || 'TOM-2025-001'}</div>
        <div className='tracking-eta'>Estimated delivery: 25–30 minutes</div>
        <div className='tracking-steps'>
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className={`tracking-step ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`}>
                <div className='tracking-step-icon'>{i < currentStep ? '✅' : step.icon}</div>
                <span className='tracking-step-label'>{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`tracking-line ${i < currentStep ? 'done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderTracking
