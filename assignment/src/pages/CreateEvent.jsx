import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateEvent.css'

function CreateEvent({ user }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'other',
    image: null,
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const formDataToSend = new FormData()
      for (const key in formData) {
        formDataToSend.append(key, formData[key])
      }

      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      })
      
      const data = await response.json()
      
      if (response.ok) {
        navigate(`/event/${data._id}`)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to create event. Please try again.')
    }
  }

  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-group">
          <label htmlFor="name">Event Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="social">Social</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Event Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="create-btn">
          Create Event
        </button>
      </form>
    </div>
  )
}

export default CreateEvent 