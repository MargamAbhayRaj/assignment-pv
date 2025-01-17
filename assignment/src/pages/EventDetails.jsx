import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './EventDetails.css'

function EventDetails({ user }) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchEventDetails()
  }, [id])

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      
      if (response.ok) {
        setEvent(data)
      } else {
        setError(data.message)
      }
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch event details')
      setLoading(false)
    }
  }

  const handleAttend = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}/attend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      
      if (response.ok) {
        setEvent(data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to update attendance')
    }
  }

  if (loading) {
    return <div className="loading">Loading event details...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!event) {
    return <div className="error-message">Event not found</div>
  }

  return (
    <div className="event-details-container">
      <div className="event-header">
        <h1>{event.name}</h1>
        {event.image && (
          <img src={event.image} alt={event.name} className="event-image" />
        )}
      </div>

      <div className="event-info">
        <div className="info-section">
          <h3>Details</h3>
          <p>{event.description}</p>
        </div>

        <div className="info-section">
          <h3>Date & Time</h3>
          <p>
            {new Date(event.date).toLocaleDateString()} at{' '}
            {event.time}
          </p>
        </div>

        <div className="info-section">
          <h3>Location</h3>
          <p>{event.location}</p>
        </div>

        <div className="info-section">
          <h3>Category</h3>
          <p>{event.category}</p>
        </div>

        <div className="info-section">
          <h3>Attendees</h3>
          <p>{event.attendees?.length || 0} people attending</p>
        </div>

        {user && (
          <button
            onClick={handleAttend}
            className="attend-btn"
            disabled={event.attendees?.includes(user._id)}
          >
            {event.attendees?.includes(user._id)
              ? 'Already Attending'
              : 'Attend Event'}
          </button>
        )}
      </div>
    </div>
  )
}

export default EventDetails 