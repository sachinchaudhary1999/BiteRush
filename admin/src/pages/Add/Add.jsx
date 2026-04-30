// ============================================================
// ADD FOOD PAGE
// Add new food items to the menu with image, name, description,
// category, and price. Submits to /api/food/add (multipart)
// ============================================================
import React, { useState } from 'react'
import './Add.css'
import { assets, url } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

// All food categories — must match what's stored in DB
const categories = ['Salad','Rolls','Deserts','Sandwich','Cake','Pure Veg','Pasta','Noodles','Biryani','Pizza','Burger','South Indian','North Indian','Chinese','Drinks','Starters']

const Add = () => {
  const [data, setData] = useState({ name:'', description:'', price:'', category:'Salad' })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const onChange = e => setData(d => ({ ...d, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!image) return toast.error('Please upload a food image')
    setLoading(true)

    // Build FormData — required for file uploads
    const fd = new FormData()
    fd.append('name', data.name)
    fd.append('description', data.description)
    fd.append('price', Number(data.price))
    fd.append('category', data.category)
    fd.append('image', image)  // File object from input

    try {
      const res = await axios.post(`${url}/api/food/add`, fd)
      if (res.data.success) {
        toast.success('✅ Food item added successfully!')
        // Reset form after successful save
        setData({ name:'', description:'', price:'', category:'Salad' })
        setImage(null)
      } else {
        toast.error(res.data.message)
      }
    } catch { toast.error('Server error — check if backend is running') }
    setLoading(false)
  }

  return (
    <div className='add-food-page'>
      <div className='page-header'>
        <div><h1>➕ Add Food Item</h1><p>Add a new dish to the menu</p></div>
      </div>

      <div className='card add-food-card'>
        <form onSubmit={onSubmit}>
          <div className='add-food-layout'>
            {/* Left: Image upload */}
            <div className='add-food-left'>
              <div className='form-group'>
                <label>Food Image *</label>
                {/* Clicking the label triggers hidden file input */}
                <label htmlFor='food-img' className='food-img-upload'>
                  {image
                    ? <img src={URL.createObjectURL(image)} alt='preview' />
                    : <>
                        <span style={{fontSize:48}}>🍽️</span>
                        <span>Click to upload image</span>
                        <span style={{fontSize:12,color:'var(--text-hint)'}}>PNG, JPG up to 5MB</span>
                      </>
                  }
                </label>
                <input type='file' id='food-img' hidden accept='image/*' onChange={e => setImage(e.target.files[0])} required />
              </div>
            </div>

            {/* Right: Form fields */}
            <div className='add-food-right'>
              <div className='form-group'>
                <label>Food Name *</label>
                <input className='form-input' name='name' value={data.name} onChange={onChange} required placeholder='e.g. Paneer Butter Masala' />
              </div>

              <div className='form-group'>
                <label>Description *</label>
                <textarea className='form-input' name='description' value={data.description} onChange={onChange} required rows={4} placeholder='Describe the dish — ingredients, taste, portion size...' />
              </div>

              <div className='form-grid-2'>
                {/* Category dropdown */}
                <div className='form-group'>
                  <label>Category *</label>
                  <select className='form-input' name='category' value={data.category} onChange={onChange}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Price in ₹ — stored in DB as USD equivalent, displayed as ₹ on frontend */}
                <div className='form-group'>
                  <label>Price (₹) *</label>
                  <div className='price-input-wrap'>
                    <span className='price-prefix'>₹</span>
                    <input className='form-input' style={{paddingLeft:30}} name='price' type='number' min='1' value={data.price} onChange={onChange} required placeholder='299' />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button type='submit' className='btn btn-primary add-submit-btn' disabled={loading}>
                {loading ? '⏳ Adding...' : '✅ Add Food Item'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Add
